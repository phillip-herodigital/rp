/* Enrollment Cart Controller
 *
 * This is used to control aspects of the cart on enrollment page.
 */
ngApp.controller('EnrollmentCartCtrl', ['$scope', '$rootScope', 'enrollmentService', 'enrollmentCartService', function ($scope, $rootScope, enrollmentService, enrollmentCartService) {
    
    /*$scope.enrollmentStepsService = enrollmentStepsService;
    $scope.utilityService = utilityProductsService;
    $scope.accountInformationService = accountInformationService;*/

    $scope.getPlans = enrollmentCartService.getPlans;
    $scope.getCartCount = enrollmentCartService.getCartCount;
    $scope.getCartItems = enrollmentCartService.getCartItems;

    /**
    * Change Plan
    */
    $scope.changeUtilityPlan = function () {
        //update active service address, sent to the correct page
        enrollmentStepsService.setStep('utilityFlowPlans');
    };

    /**
    * Edit Address
    */
    $scope.editUtilityAddress = function () {
        enrollmentStepsService.setStep('utilityFlowService');
    };

    /**
    * Delete item from cart
    */
    $scope.deleteUtilityItem = function () {
    };
}]);