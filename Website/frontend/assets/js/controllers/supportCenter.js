ngApp.controller('supportCenterCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.dropDown = false;

    $scope.faqs = [{
        name: "faq1",
        answer: "because",
        question: "why1",
        description: "description1",
        link: "/link1",
        related: ["faq2", "faq3"],
        furtherSupport: "/",
        categories: ["things", "objects"],
        states: ["Texas", "Georgia"],
        keywords: ["utility", "stuff"],
        helpful: null,
        helpfulCount: 0
    },
    {
        name: "faq2",
        answer: "because",
        question: "why2",
        description: "description2",
        link: "/link2",
        related: ["faq1", "faq3"],
        furtherSupport: "/",
        categories: ["things", "objects"],
        states: ["Texas", "Georgia"],
        keywords: ["utility", "stuff"],
        helpful: null,
        helpfulCount: 0
    },
    {
        name: "faq3",
        answer: "because",
        question: "why3",
        description: "description3",
        link: "/link3",
        related: ["faq1", "faq2"],
        furtherSupport: "/",
        categories: ["things", "objects"],
        states: ["Texas", "Georgia"],
        keywords: ["utility", "stuff"],
        helpful: null,
        helpfulCount: 0
    }];
    $scope.selectedFaqIndex = null;

    $scope.init = function (categories, popFaqs) {
        $scope.categories = categories;
        $scope.popFaqs = popFaqs;
    }

    $scope.selectCategory = function (category, state) {
        if (category.states) {
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

            //deselect popFaq
            if ($scope.selectedFaqIndex == index) {
                $scope.faqs[index].selected = false;
                $scope.selectedFaqIndex = null;
            }
            //select different popFaq
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
