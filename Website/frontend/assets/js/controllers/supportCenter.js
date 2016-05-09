ngApp.controller('supportCenterCtrl', ['$scope', '$http', '$sce', 'supportCenterService', function ($scope, $http, $sce, supportCenterService) {
    $scope.service = supportCenterService;
    $scope.dropDown = false;
    $scope.selectedFaqIndex = null;
    $scope.category = ""; //currently selected category name
    $scope.categories = []; //list of categories
    $scope.subcategories = []; //list of subcategories for $scope.category
    $scope.subcategory = "All"; //currently selected subcategory name
    $scope.faqs = []; //popular faqs on /support page, category/subcategory faqs on category/subcategory pages
    $scope.search = { //seach data
        category: "",
        state: null,
        text: ""
    }
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
    }

    $scope.categoryInit = function(categories, category, categoryFaqs, subcategories, subcategory) {
        $scope.categories = categories;
        $scope.search.category = category;
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
                $scope.keywords.push(keyword);
            });
        });
    }

    $scope.$watch("search.text", function (newVal, oldVal) {
        if (newVal != "") {
            $http({
                method: 'GET',
                url: "/api/support/search/" + $scope.search.text
            }).then(function successCallback(response) {
                $scope.searchFAQs = response.data;
            }, function errorCallback(response) {
            });
        }
    });

    $scope.search = function () {
        $http({
            method: 'GET',
            url: "/api/support/search/" + $scope.search.text
        }).then(function successCallback(response) {
            if (response.data.length == 1) {
                //one result
                if ($scope.subcategories.length) {
                    //category search
                    var categorySame = false;
                    angular.forEach(response.data[0].categories, function (category, index) {
                        if (category.name === $scope.category) {
                            categorySame = true;
                        }
                    });
                    if (categorySame) {
                        //category search, same category
                        var faqIndex = -1;
                        angular.forEach($scope.faqs, function (faq, index) {
                            if (faq.name === response.data[0].name) {
                                faqIndex = index;
                            }
                        });
                        $scope.selectFaq(faqIndex);
                    }
                    else {
                        //category search, different category
                        selectOutsideFAQ(response.data[0]);
                    }
                }
                else {
                    //one result, main search
                    selectOutsideFAQ(response.data[0]);
                }
            }
            else {
                //multiple results page
            }
        }, function errorCallback(response) {
        });
    };

    var selectOutsideFAQ = function (faq) {
        window.open("/support/" + faq.categories[0].name)
        $scope.service.setFAQ(faq);
    };

    $scope.selectCategory = function(category, state) {
        $scope.search.category = category;
        $scope.search.state = state
        $scope.dropDown = false;
        $scope.search.text = "";
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
            window.open(relatedFaq.link);
        }
    };
}]);
