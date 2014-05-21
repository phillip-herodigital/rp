/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$rootScope', 'enrollmentService', function ($scope, $rootScope, enrollmentService) {

    $scope.serverData.serviceInformation = {};

    //Complete enrollment section
    $scope.completeStep = function () {
    };

}]);