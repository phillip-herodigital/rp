ngApp.controller('ChangeMobilePlanCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', 'enrollmentStepsService', 'enrollmentCartService', function ($scope, $filter, $modal, mobileEnrollmentService, enrollmentStepsService, enrollmentCartService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.activeStep = 1;

    $scope.formFields = {
        chosenPlanId: undefined
    };

    $scope.getDataPlans = function () {
        $scope.currentPlan = {
            id: "1234",
            specialOffer: false,
            data: 5,
            dataDescription: "whatever",
            hoursMusic: "10",
            hoursMovies: "4",
            hoursWebBrowsing: "25",
            specialOfferOriginalPrice: "",
            price: "25.99"
        };
        $scope.chosenPlan = {
            id: "1235",
            name: "4GB Unlimited Voice, Data &amp; Text",
            specialOffer: false,
            data: 6,
            dataDescription: "whatever",
            hoursMusic: "10",
            hoursMovies: "4",
            hoursWebBrowsing: "25",
            specialOfferOriginalPrice: "",
            price: "35.99"
        };
        return [
            {
                id: "1234",
                specialOffer: false,
                data: 5,
                dataDescription: "whatever",
                hoursMusic: "10",
                hoursMovies: "4",
                hoursWebBrowsing: "25",
                specialOfferOriginalPrice: "",
                price: "25.99"
            },
            {
                id: "1235",
                specialOffer: false,
                data: 6,
                dataDescription: "whatever",
                hoursMusic: "10",
                hoursMovies: "4",
                hoursWebBrowsing: "25",
                specialOfferOriginalPrice: "",
                price: "35.99"
            },
            {
                id: "1236",
                specialOffer: false,
                data: 7,
                dataDescription: "whatever",
                hoursMusic: "10",
                hoursMovies: "4",
                hoursWebBrowsing: "25",
                specialOfferOriginalPrice: "",
                price: "35.99"
            },
            {
                id: "1237",
                specialOffer: false,
                data: 8,
                dataDescription: "whatever",
                hoursMusic: "10",
                hoursMovies: "4",
                hoursWebBrowsing: "25",
                specialOfferOriginalPrice: "",
                price: "35.99"
            },
        ];
        $scope.setCurrentStep('choose-phone');
    };

    $scope.selectPlan = function (plan) {
        $scope.chosenPlan = plan;
        $scope.activeStep = 2;
    };

    $scope.confirmChange = function () {
        $scope.activeStep = 3;
    };
}]);