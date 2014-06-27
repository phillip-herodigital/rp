/* Enrollment Cart Controller
 *
 * This is used to control aspects of the cart on enrollment page.
 */
ngApp.controller('EnrollmentCartCtrl', ['$scope', 'enrollmentStepsService', 'enrollmentService', 'enrollmentCartService', 'utilityProductsService', function ($scope, enrollmentStepsService, enrollmentService, enrollmentCartService, utilityProductsService) {
    
    /*$scope.enrollmentStepsService = enrollmentStepsService;
    $scope.accountInformationService = accountInformationService;*/

    $scope.getCartCount = enrollmentCartService.getCartCount;
    $scope.getCartItems = enrollmentCartService.getCartItems;
    
    /**
    * Change Plan
    */
    $scope.changeUtilityPlan = function (location) {
        //update active service address, send to the correct page
        enrollmentCartService.editUtilityAddress(location);
        enrollmentStepsService.setFlow('utility', false).setStep('utilityFlowPlans');
    };

    /**
    * Edit Address
    */
    $scope.editUtilityAddress = function (location) {
        enrollmentCartService.editUtilityAddress(location);
        enrollmentStepsService.setFlow('utility', false).setStep('utilityFlowService');
        //we should probably focus on the input field as well
    };

    /**
    * Delete item from cart
    */
    $scope.deleteUtilityPlan = function (location, selectedOffer) {
        var offerInformationTypeIndex;
        var offerSelections;
        for (var i = 0; i < location.offerInformationByType.length; i++) {
            if (location.offerInformationByType[i].key == plan.offer.offerType) {
                offerInformationTypeIndex = i;
                offerSelections = location.offerInformationByType[i].value.offerSelections;
            }
        }
        for (var i = 0; i < offerSelections.length; i++) {
            if (offerSelections[i] == selectedOffer) {
                offerSelections.splice(i, 1);
                i--;
            }
        }
        if (offerSelections.length == 0) {
            location.offerInformationByType.splice(offerInformationTypeIndex, 1);
            if (location.offerInformationByType.length == 0) {
                // remove location
                var addresses = utilityProductsService.getAddresses();
                for (var i = 0; i < addresses.length; i++) {
                    if (addresses[i] == location) {
                        addresses.splice(i, 1);
                        i--;
                    }
                }
            }
        }
        enrollmentService.setSelectedOffers();
    };
}]);