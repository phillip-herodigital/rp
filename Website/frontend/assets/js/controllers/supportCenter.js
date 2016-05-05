ngApp.controller('supportCenterCtrl', ['$scope', '$http', '$sce', 'supportCenterService', function ($scope, $http, $sce, supportCenterService) {
    $scope.dropDown = false;
    $scope.supportCenterService = supportCenterService;
    $scope.categories = supportCenterService.categories;
    $scope.popFaqs = supportCenterService.popFaqs;
    $scope.selectedFaqIndex = null;

    $scope.init = function (categories, popFaqs) {
        $scope.categories = categories;
        $scope.faqs = popFaqs;
        angular.forEach($scope.faqs, function (faq) {
            faq.faqAnswer = $sce.trustAsHtml(faq.faqAnswer);
        })
        supportCenterService.categories = categories;
        supportCenterService.popFaqs = popFaqs
    }

    $scope.categoryInit = function (categories, categoryFaqs) {
        $scope.categories = categories;
        $scope.faqs = categoryFaqs;
        angular.forEach($scope.faqs, function (faq) {
            faq.faqAnswer = $sce.trustAsHtml(faq.faqAnswer);
        })
        supportCenterService.categories = categories;
        supportCenterService.categoryFaqs = categoryFaqs
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
