ngApp.controller('supportCenterCtrl', ['$scope', '$http', '$sce', 'supportCenterService', function ($scope, $http, $sce, supportCenterService) {
    $scope.dropDown = false;
    $scope.supportCenterService = supportCenterService;
    $scope.categories = supportCenterService.categories;
    $scope.popFaqs = supportCenterService.popFaqs;
    $scope.selectedFaqIndex = null;

    $scope.init = function (categories, popFaqs) {
        $scope.categories = categories;
        $scope.popFaqs = popFaqs;
        angular.forEach(popFaqs, function (popFaq) {
            popFaq.faqAnswer = $sce.trustAsHtml(popFaq.faqAnswer);
        })
        supportCenterService.categories = categories;
        supportCenterService.popFaqs = popFaqs
    }

    $scope.categoryInit = function (categories, categoryFaqs) {
        $scope.categories = categories;
        supportCenterService.categories = categories;
        $scope.categoryFaqs = categoryFaqs;
    }

    $scope.selectCategory = function (category, state) {
        if (category.states.length) {
            if (state) {
                $scope.selectedCategory = category;
                $scope.selectedState = state;
                $scope.dropDown = false;
            }
        }
        else {
            $scope.selectedCategory = category;
            $scope.selectedState = state;
            $scope.dropDown = false;
        }
    };
    
    $scope.selectFaq = function(index) {
        //select new popFaq
        if ($scope.selectedFaqIndex == null) {
            $scope.popFaqs[index].selected = true;
            $scope.selectedFaqIndex = index;
        }
        else {
            // save helpful info
            var oldFaq = $scope.popFaqs[$scope.selectedFaqIndex];
            if (oldFaq.helpful != null) {
                if (oldFaq.helpful) {
                    oldFaq.helpfulCount++;
                }
                if (!oldFaq.helpful && oldFaq.helpfulCount > 0) {
                    oldFaq.helpfulCount--;
                }
                oldFaq.helpful = null;
            }

            //deselect popFaq
            if ($scope.selectedFaqIndex == index) {
                $scope.popFaqs[index].selected = false;
                $scope.selectedFaqIndex = null;
            }
            //select different popFaq
            else {
                angular.forEach($scope.popFaqs, function (faq) {
                    faq.selected = false;
                });
                $scope.popFaqs[index].selected = true;
                $scope.selectedFaqIndex = index;
            }
        }
    }

    $scope.selectRelated = function(parentIndex, index) {
        if ($scope.faqs[index].popular) {
            $scope.selectFaq(index);
        }
        else {
            window.open($scope.faqs[index].link);
        }
    };

    $scope.related = function(parentIndex, index) {
        return _.contains($scope.faqs[parentIndex].related, $scope.faqs[index].name);
    };
    
}]);
