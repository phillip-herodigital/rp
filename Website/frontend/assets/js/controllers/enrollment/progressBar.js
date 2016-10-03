ngApp.controller('EnrollmentProgressBarCtrl', ['$scope', '$modal', 'enrollmentService', 'mobileEnrollmentService', 'enrollmentStepsService', 'enrollmentCartService', function ($scope, $modal, enrollmentService, mobileEnrollmentService, enrollmentStepsService, enrollmentCartService) {
    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.mobileEnrollmentService.cartItemCountText = '';
    $scope.enrollmentCartService = enrollmentCartService;
    $scope.enrollmentStepsService = enrollmentStepsService;
    $scope.associateInformation = enrollmentService.associateInformation;
    $scope.addLineAccountNumber = enrollmentService.addLineAccountNumber;
    $scope.cartHasMobile = enrollmentCartService.cartHasMobile;
    $scope.cartHasProtective = enrollmentCartService.cartHasProtective;
    $scope.cartHasUtility = enrollmentCartService.cartHasUtility;

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