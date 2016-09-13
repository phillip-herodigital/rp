ngApp.controller('ProtectiveEnrollmentProgressBarCtrl', ['$scope', '$modal', 'enrollmentService', 'enrollmentStepsService', 'enrollmentCartService', function ($scope, $modal, enrollmentService, enrollmentStepsService, enrollmentCartService) {
    $scope.enrollmentCartService = enrollmentCartService;
    $scope.enrollmentStepsService = enrollmentStepsService;
    $scope.associateInformation = enrollmentService.associateInformation;

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