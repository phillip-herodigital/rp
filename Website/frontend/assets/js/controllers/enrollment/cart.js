/* Enrollment Cart Controller
 *
 * This is used to control aspects of the cart on enrollment page.
 */
ngApp.controller('EnrollmentCartCtrl', ['$scope', 'enrollmentStepsService', 'enrollmentService', 'enrollmentCartService', function ($scope, enrollmentStepsService, enrollmentService, enrollmentCartService) {
    
    /*$scope.enrollmentStepsService = enrollmentStepsService;
    $scope.utilityService = utilityProductsService;
    $scope.accountInformationService = accountInformationService;*/

    $scope.getPlans = enrollmentCartService.getPlans;
    $scope.getCartCount = enrollmentCartService.getCartCount;
    $scope.getCartItems = enrollmentCartService.getCartItems;
    
    /**
    * Change Plan
    */
    $scope.changeUtilityPlan = function (location) {
        //update active service address, send to the correct page
        //enrollmentCartService.changeUtilityPlan(location);
        enrollmentCartService.editUtilityAddress(location);
        enrollmentStepsService.setStep('utilityFlowPlans');
    };

    /**
    * Edit Address
    */
    $scope.editUtilityAddress = function (location) {
        enrollmentCartService.editUtilityAddress(location);
        enrollmentStepsService.setStep('utilityFlowService');
        //we should probably focus on the input field as well
    };

    /**
    * Delete item from cart
    */
    $scope.deleteUtilityAddress = function (location) {
        enrollmentCartService.editUtilityAddress(location);
        enrollmentCartService.deleteUtilityAddress(location);
    };
}]);