ngApp.controller('MobileEnrollmentConfigureDataCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;

    $scope.dataPlans = $scope.mobileEnrollmentService.getDataPlans($scope.mobileEnrollmentService.selectedNetwork);

    console.log($scope.dataPlans);

    $scope.formFields = {
        chosenPlanId: undefined
    };

    if($scope.mobileEnrollmentService.cart.dataPlan) {
        $scope.formFields.chosenPlanId = $scope.mobileEnrollmentService.cart.dataPlan.id;
    }

    $scope.$watch('formFields.chosenPlanId', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            console.log(newValue);
            $scope.mobileEnrollmentService.addDataPlanToCart(newValue);
        }
    });

    $scope.setDataPlan = function() {
        $scope.setCurrentStep('complete-order');
    };

}]);