ngApp.controller('supportCenterCtrl', ['$scope', '$http', '$sce', '$modal', 'scrollService', function ($scope, $http, $sce, $modal, scrollService) {
    $scope.isLoading = false;
    $scope.dropDown = false;
    $scope.selectedFaqIndex = null;
    $scope.searchFAQs = [];
    $scope.category = {
        name: "",
        states: []
    }; //currently selected category object
    $scope.categories = []; //list of categories
    $scope.subcategories = []; //list of subcategories for $scope.category
    $scope.subcategory = "All";
    $scope.faqs = []; //popular faqs on /support page, category/subcategory faqs on category/subcategory pages
    $scope.searchData = {
        category: "",
        state: null,
        text: ""
    }
    $scope.searchResults = false;
    $scope.resultsPage = 0;
    $scope.resultsPerPage = {
        value: 15,
        options: [5, 10, 15, 25, 50]
    };
    $scope.resultsPages = Math.ceil($scope.faqs.length / $scope.resultsPerPage.value);
    var scrollGuid = "";
    var scrolled = false;
    $scope.keywords = []; //list of keywords for current faq list
    $scope.noKeywordSelected = true;
    $scope.init = function (categories, popFaqs) {
        $scope.categories = categories;
        $scope.displayCategories = [];
        angular.forEach($scope.categories, function (category) {
            if (category.displayOnMainPage) {
                $scope.displayCategories.push(category);
            }
        });
        $scope.faqs = popFaqs;
        angular.forEach($scope.faqs, function (faq) {
            faq.faqAnswer = $sce.trustAsHtml(faq.faqAnswer);

            angular.forEach(faq.relatedFAQs, function (relatedFAQ, index) {
                var split = relatedFAQ.split("||");
                var categoryGuids = split[1].split("|");
                var categories = [];
                angular.forEach(categoryGuids, function (guid) {
                    angular.forEach($scope.categories, function (category) {
                        if (category.guid === guid) {
                            categories.push(category);
                        }
                    });
                });
                var object = {
                    display: split[0],
                    categories: categories,
                    guid: split[2]
                };
                faq.relatedFAQs[index] = object;
            });
        });
        $scope.isCategorySupport = false;
    }

    $scope.categoryInit = function (categories, category, categoryFaqs, subcategories, subcategory, keyword, searchFAQ, search) {
        $scope.categories = categories;
        $scope.searchData.category = category.name;
        $scope.category = category;
        $scope.faqs = categoryFaqs;
        $scope.subcategories = subcategories;
        angular.forEach($scope.faqs, function (faq) {
            faq.faqAnswer = $sce.trustAsHtml(faq.faqAnswer);
            faq.guid = faq.guid.replace("{", "");
            faq.guid = faq.guid.replace("}", "");
        });
        angular.forEach($scope.subcategories, function (subcat) {
            if (subcat.name === subcategory) {
                subcat.selected = true;
                $scope.subcategory = subcategory;
            }
        });
        if (search) {
            var searchArray = search.split("|");
            angular.forEach(categories, function (category) {
                if (category.states.length) {
                    angular.forEach($scope.category.states, function (state) {
                        if (state.name === searchArray[0]) {
                            $scope.selectCategory(category, state);
                        }
                    });
                }
            });
            if (searchArray.length === 2) {
                $scope.searchData.category = category.name;
                $scope.searchData.text = searchArray[1];
                $scope.search();
            }
        }
        if (searchFAQ) {
            angular.forEach($scope.getDisplayedFAQs(), function (faq, index) {
                if (faq.name === searchFAQ.name) {
                    scrollGuid = "id" + faq.guid;
                    $scope.selectFaq(index);
                }
            });
        };
        buildKeywords(keyword);
        paginate();
        $scope.isCategorySupport = true;
    }

    $scope.contactInit = function (categories) {
        $scope.categories = categories;
        $scope.pane = "";
        angular.forEach($scope.categories, function (category) {
            category.contactPageContent = $sce.trustAsHtml(category.contactPageContent);
            category.emergencyContactSubheading = $sce.trustAsHtml(category.emergencyContactSubheading);
            category.emergencyContactContent = $sce.trustAsHtml(category.emergencyContactContent);
            if (category.states.length) {
                angular.forEach(category.states, function (state) {
                    state.contactPageContent = $sce.trustAsHtml(state.contactPageContent);
                });
            }
        });
    }

    $scope.selectPane = function (category, state) {
        if (state) {
            $scope.pane = state.name;
        }
        else {
            $scope.pane = category.name;
        }
        $scope.category = category;
        $scope.selectCategory(category, state);
    }

    $scope.scroll = function () {
        if (!scrolled) {
            if (scrollGuid != "") {
                scrollService.scrollTo(scrollGuid, 0, 500, null);
                scrolled = true;
            }
        }
    }

    $scope.$watch("searchData.text", function (newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.searchFAQs = [];
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
        var searchUrl = encodeURI("/api/support/search/" + searchText + searchCategory + searchState + searchSubcategory);
        var promise = new Promise(function (resolve, reject) {
            $http({
                method: 'GET',
                headers : { 'Content-Type': 'application/JSON' },
                url: searchUrl,
            }).then(function successCallback(response) {
                angular.forEach(response.data, function (faq) {
                    faq.faqAnswer = $sce.trustAsHtml(faq.faqAnswer);
                });
                resolve(response.data);
            }, function errorCallback(response) {
                //handle error
                reject(null);
            });
        });
        return promise;
    }

    $scope.search = function () {
        $scope.isLoading = true;
        var promise = getSearchFaqs();
        promise.then(function (response) {
            $scope.isLoading = false;
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
                        var displayedFAQs = $scope.getDisplayedFAQs()
                        angular.forEach(displayedFAQs, function (faq, index) {
                            if (faq.name === response[0].name) {
                                faqIndex = index;
                            }
                        });
                        $scope.searchResults = false;
                        scrolled = false;
                        $scope.selectFaq(faqIndex);
                        scrollGuid = "id" + displayedFAQs[faqIndex].guid;
                        $scope.$apply();
                    }
                }
                else {
                    //same category, multiple results
                    $scope.faqs = response;
                    paginate();
                    $scope.searchResults = true;
                    buildKeywords();
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
        var text = ""
        if ($scope.searchData.text) {
            text = "|" + $scope.searchData.text;
        }
        window.location.href = "/support/" + $scope.searchData.category + "?search=" + state + text;
    };

    var paginate = function () {
        $scope.getDisplayedFAQs();
        displayLength = $scope.displayedFAQCount;
        $scope.resultsPages = Math.ceil(displayLength / $scope.resultsPerPage.value);
        $scope.resultsPageRange = [];
        if ($scope.resultsPages === 1) {
            $scope.resultsPageRange.push({ low: 0, high: displayLength - 1 });
        }
        else {
            for (var page = 0; page < $scope.resultsPages; page++) {
                var lowVal = page * $scope.resultsPerPage.value;
                var highVal = lowVal + ($scope.resultsPerPage.value - 1);
                if (highVal > displayLength - 1) highVal = displayLength - 1;
                $scope.resultsPageRange.push({ low: lowVal, high: highVal });
            }
        }
    };

    $scope.dividePaginationInto = 1;

    $scope.pageFilter1 = function (index) {
        if (index < $scope.dividePaginationInto) return true;
        else return false;
    }
    $scope.pageFilter2 = function () {
        if ($scope.resultsPage > $scope.dividePaginationInto + Math.ceil($scope.dividePaginationInto / 2)) return true;
        else return false;
    }
    $scope.pageFilter3 = function (index) {
        if (index >= $scope.resultsPage - Math.ceil($scope.dividePaginationInto / 2) &&
            index <= $scope.resultsPage + Math.ceil($scope.dividePaginationInto / 2) &&
            index >= $scope.dividePaginationInto &&
            index < $scope.resultsPages - $scope.dividePaginationInto) return true;
        else return false;
    }
    $scope.pageFilter4 = function () {
        if ($scope.resultsPage < $scope.resultsPages - $scope.dividePaginationInto - Math.ceil($scope.dividePaginationInto / 2) - 1) return true;
        else return false;
    }
    $scope.pageFilter5 = function (index) {
        if (index >= $scope.resultsPages - $scope.dividePaginationInto) return true;
        else return false;
    }

    $scope.selectCategory = function (category, state) {
        if (!category.states.length > 0 || state) {
            if (state && typeof (state.emergencyContactContent) === "string") {
                state.emergencyContactContent = $sce.trustAsHtml(state.emergencyContactContent);
            }
            $scope.searchData.category = category.name;
            $scope.searchData.state = state;
            $scope.dropDown = false;
            $scope.searchData.text = "";
            paginate();
            buildKeywords();
            $scope.resultsPage = 0;
            if (state) $scope.selectedStateName = $scope.searchData.state.name;
        }
    };

    $scope.selectCategoryByName = function (category, stateName) {
        angular.forEach($scope.category.states, function (state) {
            if (state.name === stateName) $scope.selectCategory(category, state);
        });
    }

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

    $scope.selectFaq = function (index) {
        var setResultsPage = function () {
            $scope.resultsPage = Math.floor(index / $scope.resultsPerPage.value);
        }

        //select new faq
        if ($scope.selectedFaqIndex == null) {
            $scope.getDisplayedFAQs()[index].selected = true;
            $scope.selectedFaqIndex = index;
            setResultsPage();
        }
        else {
            //deselect faq
            if ($scope.selectedFaqIndex == index) {
                $scope.getDisplayedFAQs()[index].selected = false;
                $scope.selectedFaqIndex = null;
            }
            //select different faq
            else {
                angular.forEach($scope.faqs, function (faq) {
                    faq.selected = false;
                });
                $scope.getDisplayedFAQs()[index].selected = true;
                $scope.selectedFaqIndex = index;
                setResultsPage();
            }
        }

    }

    var buildKeywords = function (queryKeyword) {
        $scope.keywords = [];
        angular.forEach($scope.faqs, function (faq) {
            if (searchStateFilter(faq) && subcategoryFilter(faq)) {
                angular.forEach(faq.keywords, function (keyword) {
                    var index = -1;
                    angular.forEach($scope.keywords, function (kword, kIndex) {
                        if (keyword === kword.name) {
                            index = kIndex;
                        }
                    });
                    if (index === -1) {
                        if (keyword === queryKeyword) {
                            $scope.noKeywordSelected = false;
                            $scope.keywords.push({
                                name: keyword,
                                selected: true,
                                count: 1
                            });
                        }
                        else {
                            $scope.keywords.push({
                                name: keyword,
                                selected: false,
                                count: 1
                            });
                        }
                    }
                    else {
                        $scope.keywords[index].count++;
                    }
                });
            }
        });
    }

    $scope.sendFeedback = function (guid, isHelpful, feedback) {
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
        $scope.searchResults = false;
        buildKeywords();
        $scope.searchData.text = "";
        $scope.resultsPage = 0;
        paginate();
    };

    $scope.getDisplayedFAQs = function () {
        var result = [];
        angular.forEach($scope.faqs, function (faq) {
            if (keywordFilter(faq) && searchStateFilter(faq) && subcategoryFilter(faq)) {
                result.push(faq);
            }
        });
        $scope.displayedFAQCount = result.length;
        return result;
    }

    $scope.splitFaqFilter = function (index) {
        if ($scope.resultsPerPage.value * $scope.resultsPage <= index && index < $scope.resultsPerPage.value * ($scope.resultsPage + 1)) {
            return true;
        }
        else {
            return false;
        }
    }

    searchStateFilter = function (faq) {
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
        angular.forEach($scope.keywords, function (keyword) {
            keyword.selected = false;
        });
        if (keyword === undefined) {
            $scope.noKeywordSelected = true;
        }
        else {
            keyword.selected = !keyword.selected;
            $scope.resultsPage = 0;
            $scope.noKeywordSelected = true;
            angular.forEach($scope.keywords, function (keyword) {
                if (keyword.selected) {
                    $scope.noKeywordSelected = false;
                }
            });
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
    $scope.showPortalModal = function (templateURL, faq, size) {
        if (typeof (faq.faqAnswer) == 'string') {
            faq.faqAnswer = $sce.trustAsHtml(faq.faqAnswer);
        }
        $scope.modalFAQ = faq;
        $modal.open({
            'scope': $scope,
            'templateUrl': templateURL,
            'size': size ? size : ''
        })
    }
}]);