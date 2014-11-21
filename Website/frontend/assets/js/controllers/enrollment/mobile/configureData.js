ngApp.controller('MobileEnrollmentConfigureDataCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;

    // start over on refresh
    $scope.$watch('dataPlans', function(newValue, oldValue) {
        if (newValue == null) {
            $scope.resetEnrollment();
        }
    });

    $scope.dataPlans = $scope.mobileEnrollmentService.getDataPlans($scope.mobileEnrollmentService.selectedNetwork.value);

    console.log($scope.dataPlans);

    $scope.formFields = {
        chosenPlanId: undefined
    };

    if($scope.mobileEnrollmentService.cart.dataPlan) {
        $scope.formFields.chosenPlanId = $scope.mobileEnrollmentService.cart.dataPlan.id;
    }

    $scope.$watch('formFields.chosenPlanId', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.mobileEnrollmentService.addDataPlanToCart(newValue);
        }
    });

    $scope.editDevice = function() {
        $scope.setCurrentStep('choose-phone');
    };

    $scope.setDataPlan = function() {
        $scope.setCurrentStep('complete-order');
    };

}]);