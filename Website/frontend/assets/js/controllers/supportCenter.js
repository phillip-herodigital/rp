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
        question: "why",
        description: "description1",
        link: "/link1",
        related: "faq2",
        furtherSupport: "/",
        categories: ["things", "objects"],
        states: ["Texas", "Georgia"],
        keywords: ["utility", "stuff"]
    },
    {
        name: "faq2",
        answer: "because",
        question: "why",
        description: "description2",
        link: "/link3",
        related: "faq1",
        furtherSupport: "/",
        categories: ["things", "objects"],
        states: ["Texas", "Georgia"],
        keywords: ["utility", "stuff"]
    }]

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
    }
}]);
