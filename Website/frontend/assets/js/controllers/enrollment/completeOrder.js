/* Enrollment Complete Order Controller
 *
 * This is used to control aspects of complete order on enrollment page.
 */
ngApp.controller('EnrollmentCompleteOrderCtrl', ['$window', '$scope', '$rootScope', 'enrollmentService', function ($window, $scope, $rootScope, enrollmentService) {

    $scope.enrollment.extraFields.verifyIdentity = {};
    $scope.enrollment.extraFields.verifyIdentity.creditCard = {};

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {

        console.log('Sending confirm order...');

        var confirmOrderPromise = enrollmentService.setConfirmOrder();

        confirmOrderPromise.then(function (data) {
            console.log(data);
            $scope.enrollment.serverData = data;
            $window.location.href = '/account/enrollment-confirmation';
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
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