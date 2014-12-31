ngApp.controller('MobileEnrollmentConfigureDataCtrl', ['$scope', '$filter', '$modal', 'enrollmentService', 'mobileEnrollmentService', 'enrollmentStepsService', 'enrollmentCartService', function ($scope, $filter, $modal, enrollmentService, mobileEnrollmentService, enrollmentStepsService, enrollmentCartService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.currentLocationInfo = enrollmentCartService.getActiveService;

    $scope.formFields = {
        chosenPlanId: undefined
    };

    $scope.filterDataPlans = function(plan){
        if (typeof mobileEnrollmentService.selectedNetwork != 'undefined') {
            var provider = mobileEnrollmentService.selectedNetwork.value,
            devicesCount = enrollmentCartService.getDevicesCount();
        
            if (devicesCount > 1) {
                return plan.provider.toLowerCase() == provider && plan.isParentOffer;
            } else {
                return plan.provider.toLowerCase() == provider && !plan.isParentOffer;
            }
        } else {
            return null;
        }
    };

    $scope.$watch(enrollmentCartService.getActiveService, function (address) {
        $scope.planSelection = { selectedOffers: {} };
        $scope.isCartFull = enrollmentCartService.isCartFull($scope.customerType);
        if (address && address.offerInformationByType) {
            angular.forEach(address.offerInformationByType, function (entry) {
                if (entry.value && entry.value.offerSelections && entry.value.offerSelections.length) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.offerSelections[0].offerId;
                } else if (entry.value && entry.value.availableOffers.length == 1) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.availableOffers[0].id;
                }
            });
        }
    });

    //Once a plan is selected, check through all available and see if a selection happend
    $scope.$watchCollection('planSelection.selectedOffers', function (selectedOffers) {
        enrollmentStepsService.setMaxStep('phoneFlowPlans');
        if (typeof selectedOffers != 'undefined') {
            // Add the temporary items array to the selected offer

            // Map the offers to arrays because, although mobile (which this controller is for) does not allow multiple offers of a type, the cart service does.
            enrollmentCartService.selectOffers(_(selectedOffers).mapValues(function (offer) { if (offer) { return [offer]; } else return []; }).value());
        }
    });

    $scope.editDevice = function() {
        $scope.setCurrentStep('choose-phone');
    };

    $scope.completeStep = function() {
        enrollmentService.setSelectedOffers(false)
    };

}]);