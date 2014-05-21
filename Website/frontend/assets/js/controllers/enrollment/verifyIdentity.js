/* Enrollment Verify Identity Controller
 *
 * This is used to control aspects of verify identity on enrollment page.
 */
ngApp.controller('EnrollmentVerifyIdentityCtrl', ['$scope', '$rootScope', 'enrollmentService', function ($scope, $rootScope, enrollmentService) {

    $scope.serverData.verifyIdentity = {};

    //Complete enrollment section
    $scope.completeStep = function () {
    };

}]);