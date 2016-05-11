ngApp.controller('supportCenterCtrl', ['$scope', '$http', '$sce', '$modal', function ($scope, $http, $sce, $modal) {
    $scope.dropDown = false;
    $scope.selectedFaqIndex = null;
    $scope.searchFAQs = [];
    $scope.category = ""; //currently selected category name
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
    $scope.isCategorySupport = false;
    $scope.keywords = []; //list of keywords for current faq list
    $scope.init = function (categories, popFaqs) {
        $scope.categories = categories;
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
        $scope.category = category.name;
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
        angular.forEach(categoryFaqs, function(faq) {
            angular.forEach(faq.keywords, function (keyword) {
                $scope.keywords.push({ name: keyword, selected: false });
            });
        });
        if (searchFAQ) {
            angular.forEach($scope.faqs, function (faq, index) {
                if (faq.name === searchFAQ.name) {
                    $scope.selectFaq(index);
                }
            });
        };
        if (search) {
            var searchArray = search.split("|");
            var searchObject = {
                category: category.name,
                state: null,
                text: searchArray[1]
            };
            angular.forEach(categories, function (category) {
                if (category.states) {
                    angular.forEach(category.states, function (state) {
                        if (state.state === searchArray[0]) {
                            searchObject.state = state;
                        }
                    });
                }
            });
            $scope.searchData = searchObject;
            $scope.faqs = getSearchFaqs();
            $scope.searchResults = true;
        }
        $scope.isCategorySupport = true;
    }

    $scope.$watch("searchData.text", function (newVal, oldVal) {
        if (newVal) {
            getSearchFaqs();
        }
    });

    var getSearchFaqs = function () {
        var searchText = $scope.searchData.text.replace("?", "");
        var searchCategory = "/-";
        var searchState = "/-";
        var searchSubcategory = "/-";
        var result = null;
        if ($scope.searchData.category) {
            searchCategory = "/" + $scope.searchData.category;
        }
        if ($scope.searchData.state) {
            searchState = "/" + $scope.searchData.state.state;
        }
        if ($scope.subcategory != "All") {
            searchSubcategory = "/" + $scope.subcategory;
        }
        var searchUrl = encodeURI("/api/support/search/" + searchText + searchCategory + searchState +searchSubcategory);
        $http({
                method: 'GET',
                url: searchUrl,
            }).then(function successCallback(response) {
                $scope.searchFAQs = response.data;
                angular.forEach($scope.searchFAQs, function (faq) {
                    faq.faqAnswer = $sce.trustAsHtml(faq.faqAnswer);
                });
                //return $scope.searchFAQs;
            }, function errorCallback(response) {
                //handle error
                return null;
            });
            return $scope.searchFAQs;
    }

    $scope.search = function () {
        var response = getSearchFaqs();;
        var mainSearch = $scope.subcategories.length === 0;
        var categorySame = !mainSearch && $scope.category === $scope.searchData.category;
        if (categorySame) {
            //same category
            if (response.length == 1) {
                //same category, one result
                var faqIndex = -1;
                angular.forEach($scope.faqs, function (faq, index) {
                    if (faq.name === response[0].name) {
                        faqIndex = index;
                    }
                });
                $scope.selectFaq(faqIndex);
            }
            else {
                //same category, multiple results
                $scope.faqs = response;
                $scope.searchResults = true;
            }
        }  
        else {
            //different category or main search
            if (response.length == 1) {
                //different category, one result
                selectOutsideFAQ(response[0]);
                $scope.searchResults = false;
            }
            else {
                //different/new category, multiple results
                selectOutsideFAQs();
            }
        }
    };

    var selectOutsideFAQ = function (faq) {
         window.location.href = "/support/" + faq.categories[0].name + "?searchFAQ=" + faq.guid;
    };

    var selectOutsideFAQs = function () {
        var state = "-";
        if ($scope.searchData.state) {
            state = $scope.searchData.state.state;
        }
        window.location.href = "/support/" + $scope.searchData.category + "?search=" + state + "|" + $scope.searchData.text;
    };

    $scope.selectCategory = function(category, state) {
        $scope.searchData.category = category.name;
        $scope.searchData.state = state
        $scope.dropDown = false;
        $scope.searchData.text = "";
    };
    
    $scope.selectSubcategory = function (index) {
        $scope.subcategory = $scope.subcategories[index].name;
        angular.forEach($scope.subcategories, function (subcat) {
            subcat.selected = false;
        });
        $scope.subcategories[index].selected = true;
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

    $scope.backToSupport = function (categoryFAQs) {
        $scope.faqs = categoryFAQs;
        angular.forEach($scope.faqs, function (faq) {
            faq.faqAnswer = $sce.trustAsHtml(faq.faqAnswer);
        });
        $scope.searchResults = false;
        $scope.searchData.text = "";
    };

    $scope.keywordFilter = function (faq) {
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
    };
    $scope.showModal = function (templateUrl, size) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl,
            'size': size ? size : ''
        })
    };
}]);
