/* Enrollment Complete Order Controller
 *
 * This is used to control aspects of complete order on enrollment page.
 */
ngApp.controller('EnrollmentCompleteOrderCtrl', ['$window', '$scope', 'enrollmentService', 'enrollmentCartService', function ($window, $scope, enrollmentService, enrollmentCartService) {

    $scope.verifyIdentity = {};
    $scope.verifyIdentity.creditCard = {};

    $scope.getPlans = enrollmentCartService.getPlans;
    $scope.getCartCount = enrollmentCartService.getCartCount;
    $scope.getCartItems = enrollmentCartService.getCartItems;    

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {

        console.log('Sending confirm order...');

        var confirmOrderPromise = enrollmentService.setConfirmOrder();

        confirmOrderPromise.then(function (data) {
            console.log(data);
            $window.location.href = '/account/enrollment-confirmation';
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