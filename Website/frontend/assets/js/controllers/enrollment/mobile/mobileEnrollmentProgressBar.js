ngApp.controller('MobileEnrollmentProgressBarCtrl', ['$scope', '$filter', '$modal', '$http', '$sce', 'enrollmentService', 'mobileEnrollmentService', 'enrollmentStepsService', 'enrollmentCartService', 'scrollService', 'analytics', function ($scope, $filter, $modal, $http, $sce, enrollmentService, mobileEnrollmentService, enrollmentStepsService, enrollmentCartService, scrollService, analytics) {
    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.mobileEnrollmentService.cartItemCountText = '';
    $scope.enrollmentCartService = enrollmentCartService;
    $scope.enrollmentStepsService = enrollmentStepsService;
    $scope.associateInformation = enrollmentService.associateInformation;
    $scope.addLineAccountNumber = enrollmentService.addLineAccountNumber;
    $scope.cartHasMobile = enrollmentCartService.cartHasMobile;

    $scope.showModal = function (templateUrl) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl
        })
    };

    $scope.openCartOverlay = function () {
        enrollmentCartService.toggleCart()
    }

    $scope.jumpToStep = function (step, currentStep, stepThreshold) {
        if (currentStep > stepThreshold) {
            $scope.enrollmentStepsService.scrollToStep(step);
        }
    }
}]);