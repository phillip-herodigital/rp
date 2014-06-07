/* Enrollment Complete Order Controller
 *
 * This is used to control aspects of complete order on enrollment page.
 */
ngApp.controller('EnrollmentCompleteOrderCtrl', ['$window', '$scope', '$rootScope', 'enrollmentService', function ($window, $scope, $rootScope, enrollmentService) {

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

}]);