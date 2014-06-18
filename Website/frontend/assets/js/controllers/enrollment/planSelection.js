/* Enrollment Plan Selection Controller
 *
 * This is used to control aspects of plan selection on enrollment page.
 */
ngApp.controller('EnrollmentPlanSelectionCtrl', ['$scope', '$rootScope', '$filter', 'enrollmentService', 'scrollService', 'utilityProductsService', function ($scope, $rootScope, $filter, enrollmentService, scrollService, utilityProductsService) {
    $scope.validations = enrollmentService.validations;

    //We need this for the button select model in the ng-repeats
    $scope.$watch(utilityProductsService.getActiveServiceAddress, function (address) {
        $scope.planSelection = { selectedOffers: {} };
        if (address && address.offerInformationByType) {
            angular.forEach(address.offerInformationByType, function (entry) {
                if (address.offerInformationByType.value && address.offerInformationByType.value.offerSelections && address.offerInformationByType.value.offerSelections.length) {
                    $scope.planSelection.selectedOffers[entry.key] = address.offerInformationByType.value.offerSelections[0].offerId;
                }
            });
        }
    });

    //Once a plan is selected, check through all available and see if a selection happend
    $scope.$watchCollection('planSelection.selectedOffers', function(plan) {
        if(typeof plan != 'undefined') { 
            utilityProductsService.selectPlan(plan);    
        }
    });

    $scope.currentLocationInfo = utilityProductsService.getActiveServiceAddress;

    $scope.isFormValid = function () {
        return true;
    };

    /**
     * Complete plan selections page
     * @param  {Boolean} Add an additional service address
     */
    $scope.completeStep = function (addAdditional) {
        var postData = utilityProductsService.createOffersPostObject();

        var selectedOffersPromise = enrollmentService.setSelectedOffers(postData);

        selectedOffersPromise.then(function (data) {
            $scope.validations = data.validations;

            //This is where we get the validations back too, need to check for that
            utilityProductsService.addServiceAddress(data.cart);

            //Move to the next section, this is the last of the utilityAccounts, so
            //If addAdditional, go back to step one else move to the next section
            if(addAdditional) {
                utilityProductsService.setActiveServiceAddress();
                utilityProductsService.isNewServiceAddress = true;
                $scope.stepsService.setStep('utilityFlowService');
                //$scope.stepsService.deActivateStep('utilityFlowPlans', true);
            } else {
                $scope.stepsService.nextStep();
            }  
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };
}]);