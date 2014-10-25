ngApp.controller('MobileEnrollmentConfigureDataCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;

    $scope.dataPlans = $scope.mobileEnrollmentService.getDataPlans($scope.mobileEnrollmentService.selectedNetwork);

    $scope.formFields = {
        chosenPlan: undefined
    };

    $scope.$watch('formFields.chosenPlan', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.mobileEnrollmentService.addDataPlanToCart(newValue);
        }
    });

    $scope.getTotalPlanData = function(plan) {
        if (plan.additionalData) {
            return parseInt(plan.baseData, 10) + parseInt(plan.additionalData, 10);
        } else {
            return parseInt(plan.baseData, 10);
        }
    }

    $scope.setDataPlan = function() {

        //$scope.mobileEnrollmentService.addDataPlanToCart($scope.formFields.chosenPlan);

        $scope.setCurrentStep('complete-order');
    };

}]);