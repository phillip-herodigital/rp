/* Enrollment Plan Selection Controller
 *
 * This is used to control aspects of plan selection on enrollment page.
 */
ngApp.controller('EnrollmentPlanSelectionCtrl', ['$scope', '$rootScope', '$filter', 'enrollmentService', 'scrollService', 'utilityProductsService', function ($scope, $rootScope, $filter, enrollmentService, scrollService, utilityProductsService) {
    $scope.validations = enrollmentService.validations;

    //We need this for the button select model in the ng-repeats
    $scope.planSelection = {};

    //Once a plan is selected, check through all available and see if a selection happend
    $scope.$watchCollection('planSelection.selectedOffers', function(plan) {
        if(typeof plan != 'undefined') { 
            utilityProductsService.selectPlan(plan);    
        }
    });

    $scope.currentLocationInfo = utilityProductsService.getActiveServiceAddress;

    $scope.isFormValid = function() {
        var offerTypesWanted = ['texasElectricity'];

        //Check if the offerTypesWanted and selected offer types are the same
        return angular.equals(offerTypesWanted, utilityProductsService.getSelectedPlanTypes());
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
                $scope.stepsService.setStep('utilityFlowService', true);
                $scope.stepsService.deActivateStep('utilityFlowPlans', true);
            } else {
                $scope.stepsService.nextStep();
            }  
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };
}]);