/* Enrollment Account Information Controller
 *
 * This is used to control aspects of account information on enrollment page.
 */
ngApp.controller('EnrollmentAccountInformationCtrl', ['$scope', '$rootScope', 'enrollmentService', function ($scope, $rootScope, enrollmentService) {

    $scope.serverData.accountInformation = {};

    //Complete enrollment section
    $scope.completeStep = function () {
    };

}]);