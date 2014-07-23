/* Enrollment Plan Selection Controller
 *
 * This is used to control aspects of plan selection on enrollment page.
 */
ngApp.controller('EnrollmentPlanSelectionCtrl', ['$scope', 'enrollmentService', 'scrollService', 'enrollmentStepsService', '$modal', 'enrollmentCartService', function ($scope, enrollmentService, scrollService, enrollmentStepsService, $modal, enrollmentCartService) {
    $scope.currentLocationInfo = enrollmentCartService.getActiveService;

    //We need this for the button select model in the ng-repeats
    $scope.$watch(enrollmentCartService.getActiveService, function (address) {
        $scope.planSelection = { selectedOffers: {} };
        if (address && address.offerInformationByType) {
            angular.forEach(address.offerInformationByType, function (entry) {
                if (entry.value && entry.value.offerSelections && entry.value.offerSelections.length) {
                    $scope.planSelection.selectedOffers[entry.key] = entry.value.offerSelections[0].offerId;
                }
            });
        }
    });

    //Once a plan is selected, check through all available and see if a selection happend
    $scope.$watchCollection('planSelection.selectedOffers', function (selectedOffers) {
        enrollmentStepsService.setMaxStep('utilityFlowPlans');
        if (typeof selectedOffers != 'undefined') {
            // Map the offers to arrays because, although utilities (which this controller is for) does not allow multiple offers of a type, the cart service does.
            enrollmentCartService.selectOffers(_(selectedOffers).mapValues(function (offer) { if (offer) { return [offer]; } else return []; }).value());
        }
    });

    /**
     * [isFormValid description]
     * @return {Boolean} [description]
     */
    $scope.isFormValid = function () {
        var isValid = true;

        //Simple check on length first
        if($scope.sizeOf($scope.planSelection.selectedOffers) == 00) {
            isValid = false;
        }

        var allNull = true;
        //Then check if any values are null in case of deselection
        angular.forEach($scope.planSelection.selectedOffers, function(value, key) {
            if(value) {
                allNull = false;
            }
        });
        isValid = isValid && !allNull;

        return isValid;
    };

    /**
     * Complete plan selections page
     * @param  {Boolean} Add an additional service address
     */
    $scope.completeStep = function (addAdditional) {
        if (!enrollmentCartService.getActiveService().location.address.line1) {

            $modal.open({
                'scope': $scope,
                'controller': 'EnrollmentZipToAddressCtrl as modal',
                'templateUrl': 'enrollmentZipToAddressPicker'
            }).result.then(function () { submitStep(addAdditional); })
        }
        else {
            submitStep(addAdditional);
        }
    };
    var submitStep = function (addAdditional) {
        var selectedOffersPromise = enrollmentService.setSelectedOffers(addAdditional);

        selectedOffersPromise.then(function (data) {
            //Move to the next section, this is the last of the utilityAccounts, so
            //If addAdditional, go back to step one else move to the next section
            if(addAdditional) {
                enrollmentCartService.setActiveService();
                enrollmentStepsService.setFlow('utility', true).setFromServerStep('serviceInformation');
            }  
        }, function (data) {
            // error response
        });
    };
}]);