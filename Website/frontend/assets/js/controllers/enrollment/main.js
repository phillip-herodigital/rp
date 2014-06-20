/* Enrollment Main Controller
 * This is the main controller for Enrollments. It will keep track of the enrollment state, as well as all fields that will need to be collected.
 */
ngApp.controller('EnrollmentMainCtrl', ['$scope', '$anchorScroll', 'enrollmentStepsService', 'enrollmentService', 'scrollService', 'jQuery', function ($scope, $anchorScroll, enrollmentStepsService, enrollmentService, scrollService, jQuery) {
    $scope.validations = enrollmentService.validations;
    $scope.stepsService = enrollmentStepsService;

    //Go ahead and set the first step to be utility for now
    //Need to determine how the first step will be activated
    //Or if we need to go ahead and activate multiple based on a saved card
    enrollmentStepsService.setInitialFlow('utility');

    /**
     * [enrollmentNavClick description]
     * @param  {[type]} step [description]
     * @return {[type]}      [description]
     */
    $scope.enrollmentNavClick = function(step) {
        if(step.isActive && step.isVisible) {
            enrollmentStepsService.scrollToStep(step.id);
        }
    }

    /**
    * Get Locations
    *
    * @param string state       //State abbreviation
    * @param string val         //Search string value
    */
    $scope.getLocation = function (state, val) {
        console.log('Getting locations...');

        return enrollmentService.getLocations(state, val).then(function (res) {
            return res.data;
        });
    };

    /**
     * Get the server data and populate the form
     */
    $scope.setServerData = function (serverData) {
        enrollmentService.setClientData(serverData);
    };

    /**
    * Size of object
    *
    * @param object obj
    *
    * return int
    */
    $scope.sizeOf = function (obj) {
        if (typeof obj == 'undefined') {
            return null;
        }
        return Object.keys(obj).length;
    };
}]);