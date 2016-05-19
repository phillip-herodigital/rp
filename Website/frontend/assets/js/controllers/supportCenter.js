ngApp.controller('supportCenterCtrl', ['$scope', '$http', '$sce', '$modal', 'scrollService', function ($scope, $http, $sce, $modal, scrollService) {
    $scope.dropDown = false;
    $scope.selectedFaqIndex = null;
    $scope.searchFAQs = [];
    $scope.category = {}; //currently selected category object
    $scope.categories = []; //list of categories
    $scope.subcategories = []; //list of subcategories for $scope.category
    $scope.subcategory = "All"; //currently selected subcategory name
    $scope.faqs = []; //popular faqs on /support page, category/subcategory faqs on category/subcategory pages
    $scope.searchData = { //seach data
        category: "",
        state: null,
        text: ""
    }
    $scope.searchResults = false;
    $scope.resultsPage = 0;
    $scope.resultsPerPage = {
        value: 15,
        options: [2, 5, 10, 15]
    };
    $scope.resultsPages = Math.ceil($scope.faqs.length / $scope.resultsPerPage.value);
    var scrollGuid = "";
    var scrollPage = 0;
    $scope.isCategorySupport = false;
    $scope.keywords = []; //list of keywords for current faq list
    $scope.init = function (categories, popFaqs) {
        $scope.categories = categories;
        $scope.category.name = "";
        $scope.faqs = popFaqs;
        angular.forEach($scope.faqs, function (faq) {
            faq.faqAnswer = $sce.trustAsHtml(faq.faqAnswer);

            angular.forEach(faq.relatedFAQs, function (relatedFAQ, index) {
                var split = relatedFAQ.split("|");
                var object = {
                    display: split[0],
                    link: split[1],
                    guid: split[2]
                };
                faq.relatedFAQs[index] = object;
            });
        });
        $scope.isCategorySupport = false;
    }

    $scope.categoryInit = function(categories, category, categoryFaqs, subcategories, subcategory, searchFAQ, search) {
        $scope.categories = categories;
        $scope.searchData.category = category.name;
        $scope.category = category;
        $scope.faqs = categoryFaqs;
        $scope.subcategories = subcategories;
        $scope.subcategory = subcategory;
        angular.forEach($scope.faqs, function (faq) {
            faq.faqAnswer = $sce.trustAsHtml(faq.faqAnswer);
        });
        angular.forEach($scope.subcategories, function (subcat) {
            if (subcat.name === subcategory) {
                subcat.selected = true;
            }
        });
        buildKeywords();
        if (searchFAQ) {
            angular.forEach($scope.faqs, function (faq, index) {
                if (faq.name === searchFAQ.name) {
                    faq.guid = faq.guid.replace("{", "");
                    faq.guid = faq.guid.replace("}", "");
                    scrollGuid = "id" + faq.guid;
                    $scope.resultsPage = Math.floor(index / $scope.resultsPerPage.value);
                    $scope.selectFaq(index);
                }
            });
        };
        if (search) {
            var searchArray = search.split("|");
            angular.forEach(categories, function (category) {
                if (category.states) {
                    angular.forEach(category.states, function (state) {
                        if (state.name === searchArray[0]) {
                            $scope.searchData.state = state;
                        }
                    });
                }
            });
            if (searchArray.length === 2) {
                $scope.searchData.category = category.name;
                $scope.searchData.text = searchArray[1];
                var promise = getSearchFaqs();
                promise.then(function (value) {
                    $scope.faqs = value;
                    $scope.searchResults = true;
                    $scope.$apply();
                }, function (error) {
                    console.log(error);
                });
            }
        }
        paginate();
        $scope.isCategorySupport = true;
    }

    $scope.scroll = function () {
        if (scrollGuid != "") {
            scrollService.scrollTo(scrollGuid, 0, 500, null);
        }
    }

    $scope.$watch("searchData.text", function (newVal, oldVal) {
        if (newVal) {
            var promise = getSearchFaqs();
            promise.then(function (value) {
                $scope.searchFAQs = value;
                $scope.$apply();
            }, function (error) {
                console.log(error);
            });
        }
    });

    var getSearchFaqs = function () {
        var searchText = "-";
        var searchCategory = "/-";
        var searchState = "/-";
        var searchSubcategory = "/-";
        var result = null;
        if ($scope.searchData.text) {
            searchText = $scope.searchData.text.replace("?", "");
        }
        if ($scope.searchData.category) {
            searchCategory = "/" + $scope.searchData.category;
        }
        if ($scope.searchData.state) {
            searchState = "/" + $scope.searchData.state.name;
        }
        if ($scope.subcategory != "All") {
            searchSubcategory = "/" + $scope.subcategory;
        }
        var searchUrl = encodeURI("/api/support/search/" + searchText + searchCategory + searchState +searchSubcategory);
        var promise = new Promise(function (resolve, reject) {
            $http({
                method: 'GET',
                url: searchUrl,
            }).then(function successCallback(response) {
                result = response.data;
                angular.forEach(result, function (faq) {
                    faq.faqAnswer = $sce.trustAsHtml(faq.faqAnswer);
                });
                resolve(result);
            }, function errorCallback(response) {
                //handle error
                reject(null);
            });
        });
        return promise;
    }

    $scope.search = function () {
        var promise = getSearchFaqs();
        promise.then(function (value) {
            var response = value
            var mainSearch = $scope.subcategories.length === 0;
            var categorySame = $scope.category.name === $scope.searchData.category;
            if (categorySame) {
                //same category
                if (response.length == 1) {
                    if (mainSearch) {
                        selectOutsideFAQ(response[0]);
                    }
                    else {
                        //same category, one result
                        var faqIndex = -1;
                        angular.forEach($scope.faqs, function (faq, index) {
                            if (faq.name === response[0].name) {
                                faqIndex = index;
                            }
                        });
                        $scope.selectFaq(faqIndex);
                        $scope.$apply();
                    }
                }
                else {
                    //same category, multiple results
                    $scope.faqs = response;
                    paginate();
                    $scope.searchResults = true;
                    $scope.$apply();
                }
            }
            else {
                //different category
                if (response.length == 1) {
                    //different category, one result
                    selectOutsideFAQ(response[0]);
                }
                else {
                    //different category, multiple results
                    selectOutsideFAQs();
                }
            }
        }
        ,
        function (error)
        { console.log(error); }
        );
    };

    var selectOutsideFAQ = function (faq) {
        var category = "";
        if ($scope.searchData.category) {
            category = $scope.searchData.category;
        }
        else {
            category = faq.categories[0].name;
        }
        if ($scope.searchData.state) {
            window.location.href = "/support/" + category + "?searchFAQ=" + faq.guid + "&search=" + $scope.searchData.state.name;
        }
        else {
            window.location.href = "/support/" + category + "?searchFAQ=" + faq.guid;
        }
    };

    var selectOutsideFAQs = function () {
        var state = "-";
        if ($scope.searchData.state) {
            state = $scope.searchData.state.name;
        }
        window.location.href = "/support/" + $scope.searchData.category + "?search=" + state + "|" + $scope.searchData.text;
    };

    var paginate = function () {
        var displayLength = $scope.getDisplayedFAQCount();
        $scope.resultsPages = Math.ceil(displayLength / $scope.resultsPerPage.value);
        $scope.resultsPageRange = [];
        for (var page = 0; page < $scope.resultsPages; page++) {
            var lowVal = page * $scope.resultsPerPage.value;
            var highVal = lowVal + ($scope.resultsPerPage.value - 1);
            if (highVal > displayLength - 1) highVal = displayLength -1;
            $scope.resultsPageRange.push({ low: lowVal, high: highVal });
        }
    };

    $scope.getDisplayedFAQCount = function () {
        var displayCount = 0;
        angular.forEach($scope.faqs, function (faq, index) {
            if (keywordFilter(faq) && searchStateFilter(faq) && subcategoryFilter(faq)) {
                displayCount++;
            }
        });
        return displayCount;
}

    $scope.selectCategory = function (category, state) {
        $scope.searchData.category = category.name;
        $scope.searchData.state = state
        $scope.dropDown = false;
        $scope.searchData.text = "";
        paginate();
        buildKeywords();
        $scope.resultsPage = 0;
    };
    
    $scope.selectSubcategory = function (index) {
        $scope.subcategory = $scope.subcategories[index].name;
        angular.forEach($scope.subcategories, function (subcat) {
            subcat.selected = false;
        });
        $scope.subcategories[index].selected = true;
        paginate();
        buildKeywords();
        $scope.resultsPage = 0;
    }

    $scope.selectFaq = function(index) {
        //select new faq
        if ($scope.selectedFaqIndex == null) {
            $scope.faqs[index].selected = true;
            $scope.selectedFaqIndex = index;
        }
        else {
            // save helpful info
            var oldFaq = $scope.faqs[$scope.selectedFaqIndex];
            if (oldFaq.helpful != null) {
                if (oldFaq.helpful) {
                    oldFaq.helpfulCount++;
                }
                if (!oldFaq.helpful && oldFaq.helpfulCount > 0) {
                    oldFaq.helpfulCount--;
                }
                oldFaq.helpful = null;
            }

            //deselect faq
            if ($scope.selectedFaqIndex == index) {
                $scope.faqs[index].selected = false;
                $scope.selectedFaqIndex = null;
            }
            //select different faq
            else {
                angular.forEach($scope.faqs, function (faq) {
                    faq.selected = false;
                });
                $scope.faqs[index].selected = true;
                $scope.selectedFaqIndex = index;
            }
        }
    }

    var buildKeywords = function () {
        $scope.keywords = [];
        angular.forEach($scope.faqs, function (faq) {
            if (keywordFilter(faq) && searchStateFilter(faq) && subcategoryFilter(faq)) {
                angular.forEach(faq.keywords, function (keyword) {
                    if ($scope.keywords.indexOf(keyword) === -1) {
                        $scope.keywords.push({
                            name: keyword,
                            selected: false
                        });
                    }
                });
            }
        });
    }

    $scope.sendFeedback = function(guid, isHelpful, feedback) {
        $http.post("/api/support/sendFeedback", {
            guid: guid,
            isHelpful: isHelpful,
            comment: feedback
        })
            .then(function successCallback(response) {
                if (response.data) {
                    console.log("feedback sent");
                }
                else {
                    handleException();
                }
            }, function errorCallback(response) {
                handleException();
            });
        var handleException = function () {
            console.log("feedback failed");
        }
    }

    $scope.selectRelated = function (relatedFaq) {
        var isFaqPopular = false;
        var popFaqIndex = -1;
        angular.forEach($scope.faqs, function (faq, index) {
            if (faq.name === relatedFaq.display) {
                isFaqPopular = true;
                popFaqIndex = index;
            }
        });
        if (isFaqPopular) {
            $scope.selectFaq(popFaqIndex);
        }
        else {
            selectOutsideFAQ(relatedFaq);
        }
    };

    $scope.setResultsPage = function (page) {
        if (page >= 0 && page < $scope.resultsPages) {
            $scope.resultsPage = page;
        }
    }

    $scope.setResultsPerPage = function () {
        $scope.resultsPage = 0;
        paginate();
    }

    $scope.backToSupport = function (FAQs) {
        $scope.faqs = FAQs;
        angular.forEach($scope.faqs, function (faq) {
            faq.faqAnswer = $sce.trustAsHtml(faq.faqAnswer);
        });
        $scope.searchResults = false;
        $scope.searchData.text = "";
    };

    $scope.faqFilter = function (faq, index) {
        return (keywordFilter(faq) && searchStateFilter(faq) && subcategoryFilter(faq) && splitFaqFilter(faq, index));
    }

    splitFaqFilter = function (faq, index) {
        if ($scope.resultsPerPage.value * $scope.resultsPage <= index && index < $scope.resultsPerPage.value * ($scope.resultsPage + 1)) {
            return true;
        }
        else {
            return false;
        }
    }

    searchStateFilter = function(faq){
        if ($scope.searchData.state == null || !$scope.category.states.length) {
            return true;
        }
        else {
            var filter = false;
            angular.forEach(faq.states, function (state) {
                if (state.name === $scope.searchData.state.name) {
                    filter = true;
                }
            });
            return filter;
        }
    }

    subcategoryFilter = function (faq) {
        if ($scope.subcategory != "All") {
            var filter = false;
            angular.forEach(faq.subCategories, function (subcat) {
                if (subcat.name === $scope.subcategory) {
                    filter = true;
                }
            });
            return filter;
        }
        else {
            return true;
        }
    }

    keywordFilter = function (faq) {
        var result = true;
        var filters = [];
        var filter = true;
        var noneSelected = true;
        angular.forEach($scope.keywords, function (keyword) {
            if (keyword.selected) {
                filter = true;
                angular.forEach(faq.keywords, function (faqKeyword) {
                    if (keyword.name === faqKeyword) {
                        filter = false;
                    }
                });
                filters.push(filter);
                noneSelected = false;
            }
        });
        angular.forEach(filters, function (value) {
            if (value) {
                result = false;
            };
        });
        return (noneSelected || result);
    };

    $scope.toggleKeyword = function (keyword) {
        if (keyword.selected) {
            keyword.selected = false;
        }
        else {
            keyword.selected = true;
        }
        paginate();
    };
    $scope.showModal = function (templateUrl, size) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl,
            'size': size ? size : ''
        })
    };
}]);