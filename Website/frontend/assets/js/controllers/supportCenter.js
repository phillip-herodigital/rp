ngApp.controller('supportCenterCtrl', ['$scope', '$http', '$sce', '$modal', 'scrollService', 'orderByFilter', function ($scope, $http, $sce, $modal, scrollService, orderByFilter) {
    $scope.dropDown = false;
    $scope.selectedFaqIndex = null;
    $scope.category = { //currently selected category object
        name: "",
        states: []
    }; 
    $scope.categories = []; //list of all categories
    $scope.subcategories = []; //list of subcategories for $scope.category
    $scope.subcategory = "All"; //currently selected subcategory
    $scope.faqs = []; //popular faqs on /support page, displayed faqs for category/subcategory on category/subcategory pages

    $scope.searchData = { //data for text searches 
        category: "",
        state: null,
        text: ""
    }
    $scope.searchedData = {}; //data used for a text search

    var allFAQs = [];
    $scope.searchResults = false;
    $scope.noSearchResults = false;
    $scope.resultsPage = 0;
    $scope.resultsPerPage = 15;
    $scope.resultsPages = 0;
    $scope.resultsPageRange = {};
    var scrollGuid = "";
    var scrolled = false;
    $scope.keywords = []; //list of keywords for current faq list
    var selectedKeyword = "";
    $scope.noKeywordSelected = true;

    $scope.init = function () {
        $scope.isLoading = true;
        $http({
            method: 'Get',
            headers: { 'Content-Type': 'application/JSON' },
            url: '/api/support/init',
        }).then(function successCallback(response) {
            $scope.isLoading = false;
            angular.forEach(response.data.categories, function (category) {
                if (category.displayOnMainPage) {
                    $scope.categories.push(category);
                }
            });
            var div = document.createElement('div');
            angular.forEach(response.data.faQs, function (faq) {
                div.innerHTML = faq.faqAnswer;
                faq.faqAnswer = $sce.trustAsHtml(div.textContent);
                div.innerHTML = faq.faqQuestion;
                faq.faqQuestion = div.textContent;
                angular.forEach(faq.categories, function (faqCat, index) {
                    faq.categories[index] = {
                        name: faqCat.split("|")[0],
                        guid: faqCat.split("|")[1]
                    };
                });
                angular.forEach(faq.relatedFAQs, function (relatedFAQ, index) {
                    var split = relatedFAQ.split("||");
                    var categories = [];
                    angular.forEach(split[1].split("|"), function (guid) {
                        angular.forEach($scope.categories, function (category) {
                            if (category.guid === guid) {
                                categories.push(category);
                            }
                        });
                    });
                    faq.relatedFAQs[index] = {
                        display: split[0],
                        categories: categories,
                        guid: split[2]
                    };
                });
            });
            $scope.faqs = response.data.faQs;
            $scope.isLoading = false;
        }, function errorCallback(response) {
            $scope.isLoading = false;
            console.log(response);
        });
        $scope.isCategorySupport = false;
    }

    $scope.searchInit = function (selectSearchPlaceholder, defaultSearchPlaceholder) {
        $scope.searchPlaceholder = selectSearchPlaceholder;
        $scope.selectSearchPlaceholder = selectSearchPlaceholder
        $scope.defaultSearchPlaceholder = defaultSearchPlaceholder;
    }

    $scope.categoryInit = function (category, subcategory, keyword, search) {
        $scope.isLoading = true;
        $scope.searchData.category = category;
        $scope.category = category;
        if (category.states.length == 0) {
            $scope.searchPlaceholder = $scope.defaultSearchPlaceholder;
        }
        $scope.isCategorySupport = true;
        $http({
            method: 'Post',
            data: {
                query: "",
                category: category.guid,
                state: null,
                subcategory: null,
                keyword: null
            },
            headers: { 'Content-Type': 'application/JSON' },
            url: '/api/support/categoryInit',
        }).then(function successCallback(response) {
            angular.forEach(response.data.categories, function (category) {
                if (category.displayOnMainPage) {
                    $scope.categories.push(category);
                }
            });
            $scope.subcategories = response.data.subcategories;
            angular.forEach($scope.subcategories, function (subcat) {
                if (subcat.name === subcategory) {
                    subcat.selected = true;
                    if (subcategory != "All") {
                        $scope.subcategory = subcat.guid;
                    }
                }
            });
            var div = document.createElement('div');
            angular.forEach(response.data.faQs, function (faq) {
                div.innerHTML = faq.faqAnswer;
                faq.faqAnswer = $sce.trustAsHtml(div.textContent);
                div.innerHTML = faq.faqQuestion;
                faq.faqQuestion = div.textContent;
                angular.forEach(faq.categories, function (faqCat, index) {
                    faq.categories[index] = {
                        name: faqCat.split("|")[0],
                        guid: faqCat.split("|")[1]
                    };
                });
            });
            allFAQs = $scope.faqs = response.data.faQs;
            $scope.displayedFAQCount = response.data.faQs.length;
            if (search) {
                var searchArray = search.split("|");
                angular.forEach($scope.categories, function (category) {
                    if (category.states.length) {
                        angular.forEach($scope.category.states, function (state) {
                            if (state.name === searchArray[0]) {
                                $scope.selectCategory(category, state);
                            }
                        });
                    }
                });
                $scope.searchData.text = searchArray[1];
                $scope.search();
            }
            else {
                $scope.isLoading = false;
                buildKeywords(keyword);
                paginate();
            }

        }, function errorCallback(response) {
            $scope.isLoading = false;
            console.log(response);
        });
    }

    $scope.contactInit = function () {
        $scope.isLoading = true;
        $scope.pane = "";
        $http({
            method: 'Get',
            url: "/api/support/contactInit"
        }).then(function success(response) {
            angular.forEach(response.data, function (category) {
                if (category.displayOnContactPage) {
                    $scope.categories.push(category);
                }
            });
            $scope.isLoading = false;
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
        }, function error(response) {
            console.log(response);
            $scope.isLoading = false;
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
        if ($("body").width() < 768) {
            scrollService.scrollTo("categoryContact", 0, 500, null);
        }
    }

    $scope.searchbarClick = function () {
        if (!$scope.searchData.category || ($scope.searchData.category.states.length && !$scope.searchData.state)) {
            $scope.dropDown = !$scope.dropDown;
        }
    }

    $scope.scroll = function () {
        if (!scrolled) {
            if (scrollGuid != "") {
                scrollService.scrollTo(scrollGuid, 0, 500, null);
                scrolled = true;
            }
        }
    }

    var getFAQs = function (searchRequest) {
        var promise = new Promise(function (resolve, reject) {
            $http({
                method: 'Post',
                data: searchRequest,
                url: "/api/support/search"
            }).then(function success(response) {
                var div = document.createElement('div');
                angular.forEach(response.data, function (faq) {
                    div.innerHTML = faq.faqAnswer;
                    faq.faqAnswer = $sce.trustAsHtml(div.textContent);
                    div.innerHTML = faq.faqQuestion;
                    faq.faqQuestion = div.textContent;
                    angular.forEach(faq.categories, function (faqCat, index) {
                        faq.categories[index] = {
                            name: faqCat.split("|")[0],
                            guid: faqCat.split("|")[1]
                        };
                    });
                });
                resolve(response.data);
            }, function error(response) {
                reject(response);
            });
        });
        return promise;
    }

    $scope.getSearchFaqs = function (viewValue) {
        $scope.noSearchResults = false;
        var request = {
            query: viewValue,
            category: $scope.searchData.category.displayTitle,
            state: $scope.searchData.state ? $scope.searchData.state.name : null,
            subcategory: null,
            keyword: null,
        }
        var promise = new Promise(function (resolve, reject) {
            getFAQs(request).then(function (response) {
                if ($scope.isLoading) {
                    resolve([]);
                }
                else {
                    resolve(response.slice(0, 4));
                    if (response.length == 0 && $scope.searchData.text) {
                        $scope.noSearchResults = true;
                    }
                }
            }, function (error) {
                reject(null);
            });
        });
        return promise;
    }

    $scope.search = function () {
        $scope.isLoading = true;
        angular.copy($scope.searchData, $scope.searchedData);
        $scope.isSearchLoading = false;
        $scope.toggleKeyword();
        var request = {
            query: $scope.searchData.text,
            category: $scope.searchData.category.displayTitle,
            state: $scope.searchData.state ? $scope.searchData.state.name : null,
            subcategory: null,
            keyword: null,
        };
        getFAQs(request).then(function (response) {
            $scope.isLoading = false;
            var categorySame = $scope.category.name === $scope.searchData.category.displayTitle;
            if (categorySame) {
                //same category
                if (response.length == 1) {
                    //same category, one result
                    var faqIndex = -1;
                    var displayedFAQs = $scope.getDisplayedFAQs()
                    angular.forEach(displayedFAQs, function (faq, index) {
                        if (faq.guid === response[0].guid) {
                            faqIndex = index;
                        }
                    });
                    $scope.searchResults = false;
                    scrolled = false;
                    $scope.selectFaq(faqIndex);
                    $scope.searchData.text = "";
                    scrollGuid = "id" + displayedFAQs[faqIndex].guid;
                    $scope.$apply();
                }
                else {
                    //same category, multiple results
                    $scope.faqs = response;
                    $scope.displayedFAQCount = response.length;
                    paginate();
                    $scope.searchResults = true;
                    buildKeywords();
                    $scope.$apply();
                }
            }
            else {
                //different category
                var state = "-";
                if ($scope.searchData.state) {
                    state = $scope.searchData.state.name;
                }
                var text = ""
                if ($scope.searchData.text) {
                    text = "|" + $scope.searchData.text;
                }
                window.location.href = "/support/" + $scope.searchData.category.displayTitle + "?search=" + state + text;
            }
        }, function (error) {
            console.log(error);
        });
    };

    $scope.goto = function (link) {
        window.location.href = link;
    }

    var paginate = function () {
        var displayFAQs = $scope.getDisplayedFAQs();
        $scope.resultsPages = Math.ceil($scope.displayedFAQCount / $scope.resultsPerPage);
        $scope.resultsPageRange = [];
        if ($scope.resultsPages === 1) {
            $scope.resultsPageRange.push({ low: 0, high: $scope.displayedFAQCount - 1 });
        }
        else {
            if ($scope.displayedFAQCount === 0) {
                $scope.resultsPageRange.push({ low: -1, high: -1 });
            }
            else {
                for (var page = 0; page < $scope.resultsPages; page++) {
                    var lowVal = page * $scope.resultsPerPage;
                    var highVal = lowVal + ($scope.resultsPerPage - 1);
                    if (highVal > $scope.displayedFAQCount - 1) highVal = $scope.displayedFAQCount - 1;
                    $scope.resultsPageRange.push({ low: lowVal, high: highVal });
                }
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
                state.contactContent = $sce.trustAsHtml(state.contactContent);
            }
            $scope.searchData.category = category;
            $scope.searchData.state = state;
            $scope.dropDown = false;
            $scope.searchPlaceholder = $scope.defaultSearchPlaceholder;
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
        $scope.subcategory = ($scope.subcategories[index].name == "All") ? "All": $scope.subcategory = $scope.subcategories[index].guid;

        angular.forEach($scope.subcategories, function (subcat) {
            subcat.selected = false;
        });
        $scope.subcategories[index].selected = true;
        $scope.mobileAcronyms = false;
        paginate();
        buildKeywords();
        $scope.toggleKeyword();
        $scope.resultsPage = 0;
        }

    $scope.selectFaq = function (index) {
        //select new faq
        if ($scope.selectedFaqIndex == null) {
            $scope.getDisplayedFAQs()[index].selected = true;
            $scope.selectedFaqIndex = index;
            $scope.resultsPage = Math.floor(index / $scope.resultsPerPage);
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
                $scope.resultsPage = Math.floor(index / $scope.resultsPerPage);
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
                        if (keyword.toLowerCase() === kword.name.toLowerCase()) {
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
        $scope.keywords = orderByFilter($scope.keywords, "name");
    }

    $scope.sendFeedback = function (faq, isHelpful, feedback) {
        var request = {
            guid: faq.guid,
            isHelpful: isHelpful,
            comment: feedback
        }
        var handleException = function () {
            faq.feedbackError = true;
            console.log("feedback failed");
        }
        $http({
            method: 'Post',
            data: request,
            headers: { 'Content-Type': 'application/JSON' },
            url: "/api/support/sendFeedback"
        }).then(function successCallback(response) {
            if (response.data.success) {
                faq.feedbackSent = true;
                console.log("feedback sent");
            }
            else {
                handleException();
            }
        }, function errorCallback(response) {
            handleException();
        });
    }

    $scope.selectRelated = function (relatedFaq) {
        var isFaqPopular = false;
        var popFaqIndex = -1;
        angular.forEach($scope.faqs, function (faq, index) {
            if (relatedFaq.guid.includes(faq.guid)) {
                isFaqPopular = true;
                popFaqIndex = index;
            }
        });
        if (isFaqPopular) {
            $scope.selectFaq(popFaqIndex);
        }
        else {
            $scope.isLoading = true;
            selectOutsideFAQ(relatedFaq);
        }
    };

    $scope.setResultsPage = function (page) {
        if (page >= 0 && page < $scope.resultsPages) {
            $scope.resultsPage = page;
            scrollService.scrollTo("pageScroll", 0, 500, null);
        }
    }

    $scope.backToSupport = function () {
        $scope.faqs = allFAQs;
        angular.forEach($scope.faqs, function (faq) {
            faq.selected = false;
        });
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
        if ($scope.resultsPerPage * $scope.resultsPage <= index && index < $scope.resultsPerPage * ($scope.resultsPage + 1)) {
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
                if (state === $scope.searchData.state.guid) {
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
                if (subcat === $scope.subcategory) {
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
                    if (keyword.name.toLowerCase() === faqKeyword.toLowerCase()) {
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

    $scope.toggleKeyword = function (keywordToToggle) {
        if (keywordToToggle === undefined) {
            angular.forEach($scope.keywords, function (keyword) {
                keyword.selected = false;
            });
            $scope.noKeywordSelected = true;
        }
        else {
            angular.forEach($scope.keywords, function (keyword) {
                if (keywordToToggle.name != keyword.name) {
                    keyword.selected = false;
                }
            });
            keywordToToggle.selected = !keywordToToggle.selected;
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