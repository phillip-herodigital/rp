ngApp.controller('supportCenterCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.services = [
        {
            title: "Utility",
            name: "Utility",
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
            link: "/"
        },
        {
            title: "Protective",
            name: "Protective",
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
            }
        }
        else {
            $scope.selectedService = service;
            $scope.selectedState = state;
        }
    }
}]);
