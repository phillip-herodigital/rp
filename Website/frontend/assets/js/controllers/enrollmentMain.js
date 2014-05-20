/* Enrollment Main Controller
 * This is the main controller for Enrollments. It will keep track of the enrollment state, as well as all fields that will need to be collected.
 */
ngApp.controller('EnrollmentMainCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.enrollmentFields = []; // This array should keep track of all the form fields we collect for the enrollment
    $scope.currentStep = '';

}]);