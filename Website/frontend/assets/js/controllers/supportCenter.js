ngApp.controller('supportCenterCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
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
        angular.forEach(popFaqs, function (popFaq) {
            popFaq.faqAnswer = $sce.trustAsHtml(popFaq.faqAnswer);
        })
    }

    $scope.getAllFaqsForCategory = function (categoryFaqs) {
        $scope.categoryFaqs = categoryFaqs;
    }

    $scope.getAllFaqsForSubcategory = function (subcategoryFaqs) {
        $scope.subcategoryFaqs = subcategoryFaqs;
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
