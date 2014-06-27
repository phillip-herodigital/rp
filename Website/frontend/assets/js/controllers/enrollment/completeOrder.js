/* Enrollment Complete Order Controller
 *
 * This is used to control aspects of complete order on enrollment page.
 */
ngApp.controller('EnrollmentCompleteOrderCtrl', ['$scope', 'enrollmentService', 'enrollmentCartService', function ($scope, enrollmentService, enrollmentCartService) {

    $scope.completeOrder = {
        agreeToTerms: false,
        creditCard: {}
    };

    $scope.getPlans = enrollmentCartService.getSelectedPlans;
    $scope.getCartCount = enrollmentCartService.getCartCount;
    $scope.getCartItems = enrollmentCartService.getCartItems;  
    $scope.getCartTotal = enrollmentCartService.calculateCartTotal;  

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {

        console.log('Sending confirm order...');

        var confirmOrderPromise = enrollmentService.setConfirmOrder({
            agreeToTerms: $scope.completeOrder.agreeToTerms,
            paymentInfo: null
        });

        confirmOrderPromise.then(function (data) {
        }, function (data) {
            // error response
        });
    };

    /**
    * Calculate Total
    *
    * @param object plans
    *
    * return int
    */
    $scope.calculateTotal = function (plans) {
        var total = 0;

        angular.forEach(plans, function (value, key) {
            total += value.paymentInformation.amount;
        });

        return total;
    };

}]);