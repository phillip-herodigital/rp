ngApp.controller('MobileEnrollmentConfigureDataCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', 'enrollmentStepsService', 'enrollmentCartService', function ($scope, $filter, $modal, mobileEnrollmentService, enrollmentStepsService, enrollmentCartService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.dataPlan = {};
    //$scope.getDataPlans = $scope.mobileEnrollmentService.getDataPlans($scope.mobileEnrollmentService.selectedNetwork.value);

    $scope.formFields = {
        chosenPlanId: undefined
    };

    //if(enrollmentCartService.cart.dataPlan) {
    //    $scope.formFields.chosenPlanId = $scope.mobileEnrollmentService.cart.dataPlan.id;
    //}

    $scope.$watch('formFields.chosenPlanId', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            var plan = _.where(mobileEnrollmentService.getDataPlans(), { id: newValue })[0];
            $scope.dataPlan = plan;
            enrollmentCartService.addDataPlanToCart(plan);
        }
    });

    $scope.editDevice = function() {
        $scope.setCurrentStep('choose-phone');
    };

    $scope.setDataPlan = function() {
        $scope.setCurrentStep('complete-order');
    };

}]);