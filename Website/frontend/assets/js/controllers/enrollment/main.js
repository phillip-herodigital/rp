/* Enrollment Main Controller
 * This is the main controller for Enrollments. It will keep track of the enrollment state, as well as all fields that will need to be collected.
 */
ngApp.controller('EnrollmentMainCtrl', ['$scope', '$rootScope', '$http', 'enrollmentService', function ($scope, $rootScope, $http, enrollmentService) {

    $scope.serverData = {}; // This array should keep track of all the form fields we collect for the enrollment
    $scope.currentStep = '';

    $scope.setServerData = function () {
        //TODO: Replace AJAX with static variable once available
        console.log('Setting initial server data:');

        var clientDataPromise = enrollmentService.getClientData();

        clientDataPromise.then(function (data) {
            console.log(data);
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

}]);