ngApp.controller('supportCenterCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.dropDown = false;
    $scope.services = [
        {
            title: "Energy (select state)",
            name: "Energy",
            description: "Energy is lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            states: [{
                name: "Texas",
                abbreviation: "TX"
            },
            {
                name: "Georgia",
                abbreviation: "GA"
            }],
            link: "/"
        },
        {
            title: "Mobile",
            name: "Mobile",
            description: "Mobile is lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            link: "/"
        },
        {
            title: "Protective",
            name: "Protective",
            description: "Protective is lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            link: "/"
        },
        {
            title: "Home",
            name: "Home",
            description: "Home is lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            link: "/"
        },
        {
            title: "Opportunity",
            name: "Opportunity",
            description: "Opportunity is lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            link: "/"
        },
        {
            title: "Stream",
            name: "Stream",
            description: "Stream is lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            link: "/"
        }
    ];

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
        popular: true,
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
        popular: true,
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
        popular: false,
        helpful: null,
        helpfulCount: 0
    }];
    $scope.selectedFaqIndex = null;

    $scope.selectService = function (service, state) {
        if (service.states) {
            if (state) {
                $scope.selectedService = service;
                $scope.selectedState = state;
                $scope.dropDown = false;
            }
        }
        else {
            $scope.selectedService = service;
            $scope.selectedState = state;
            $scope.dropDown = false;
        }
    };
    
    $scope.selectFaq = function (index) {
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

    $scope.related = function (parentIndex, index) {
        return _.contains($scope.faqs[parentIndex].related, $scope.faqs[index].name);
    };
    
}]);
