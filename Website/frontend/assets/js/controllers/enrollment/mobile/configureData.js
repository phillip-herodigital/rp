ngApp.controller('MobileEnrollmentConfigureDataCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', 'enrollmentStepsService', 'enrollmentCartService', function ($scope, $filter, $modal, mobileEnrollmentService, enrollmentStepsService, enrollmentCartService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.currentLocationInfo = enrollmentCartService.getActiveService;

    $scope.formFields = {
        chosenPlanId: undefined
    };

    $scope.filterDataPlans = function(plan){
        var provider = mobileEnrollmentService.selectedNetwork.value,
            devicesCount = enrollmentCartService.getDevicesCount();
        
        if (devicesCount > 1) {
            return plan.provider.toLowerCase() == provider && plan.isParentOffer;
        } else {
            return plan.provider.toLowerCase() == provider && !plan.isParentOffer;
        }
    };

    //if(enrollmentCartService.cart.dataPlan) {
    //    $scope.formFields.chosenPlanId = $scope.mobileEnrollmentService.cart.dataPlan.id;
    //}

    //Once a plan is selected, check through all available and see if a selection happend
    $scope.$watchCollection('planSelection.selectedOffers', function (selectedOffers) {
        enrollmentStepsService.setMaxStep('phoneFlowPlans');
        if (typeof selectedOffers != 'undefined') {
            // Map the offers to arrays because, although utilities (which this controller is for) does not allow multiple offers of a type, the cart service does.
            enrollmentCartService.selectOffers(_(selectedOffers).mapValues(function (offer) { if (offer) { return [offer]; } else return []; }).value());
        }
    });
/*
    $scope.$watch('formFields.chosenPlanId', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            var plan = _.where(mobileEnrollmentService.getDataPlans(), { id: newValue })[0];
            $scope.dataPlan = plan;
            enrollmentCartService.addDataPlanToCart(plan);
        }
    });
*/
    $scope.editDevice = function() {
        $scope.setCurrentStep('choose-phone');
    };

    $scope.setDataPlan = function() {
        $scope.setCurrentStep('complete-order');
    };

}]);