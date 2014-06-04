/* Enrollment Account Information Controller
 *
 * This is used to control aspects of account information on enrollment page.
 */
ngApp.controller('EnrollmentAccountInformationCtrl', ['$scope', '$rootScope', 'enrollmentService', function ($scope, $rootScope, enrollmentService) {

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        console.log('Sending account information...');

        var confirmOrderPromise = enrollmentService.setConfirmOrder();

        confirmOrderPromise.then(function (data) {
            $scope.enrollment.serverData = data;

            $scope.activateSections('verifyIdentity');
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

}]);