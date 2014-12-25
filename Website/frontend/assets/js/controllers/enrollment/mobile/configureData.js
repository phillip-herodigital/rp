ngApp.controller('MobileEnrollmentConfigureDataCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', 'enrollmentStepsService', 'enrollmentCartService', function ($scope, $filter, $modal, mobileEnrollmentService, enrollmentStepsService, enrollmentCartService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;

    $scope.$watch(enrollmentCartService.getActiveService, function (address) {
        $scope.planSelection = { selectedOffers: {} };
        $scope.isCartFull = enrollmentCartService.isCartFull($scope.customerType);
        
        $scope.dataPlans = $scope.mobileEnrollmentService.getDataPlans($scope.mobileEnrollmentService.selectedNetwork.value);
    });

    $scope.formFields = {
        chosenPlanId: undefined
    };

    //if(enrollmentCartService.cart.dataPlan) {
    //    $scope.formFields.chosenPlanId = $scope.mobileEnrollmentService.cart.dataPlan.id;
    //}

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