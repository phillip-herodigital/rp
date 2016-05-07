ngApp.controller('supportCenterCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
    $scope.dropDown = false;
    $scope.selectedFaqIndex = null;
    $scope.categories = [];
    $scope.category = null;
    $scope.subcategories = [];
    $scope.subcategory = "All";
    $scope.faqs = [];
    $scope.keywords = [];

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
        angular.forEach(categoryFaqs, function(faq) {
            angular.forEach(faq.keywords, function (keyword) {
                $scope.keywords.push(keyword);
            });
        });
    }

    $scope.selectCategory = function(category, state) {
        if (category.states.length) {
            if (state) {
                $scope.category = category;
                $scope.selectedState = state;
                $scope.dropDown = false;
            }
        }
        else {
            $scope.category = category;
            $scope.selectedState = state;
            $scope.dropDown = false;
        }
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
