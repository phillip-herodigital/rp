/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$rootScope', 'enrollmentService', function ($scope, $rootScope, enrollmentService) {

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        console.log('Sending service information...');

        var serviceInformationPromise = enrollmentService.setServiceInformation();

        serviceInformationPromise.then(function (data) {
            console.log(data);
            $scope.serverData = data;
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

}]);