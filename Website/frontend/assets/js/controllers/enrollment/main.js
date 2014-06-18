/* Enrollment Main Controller
 * This is the main controller for Enrollments. It will keep track of the enrollment state, as well as all fields that will need to be collected.
 */
ngApp.controller('EnrollmentMainCtrl', ['$scope', '$rootScope', '$http', '$anchorScroll', '$timeout', '$filter', 'enrollmentStepsService', 'enrollmentService', 'scrollService', 'jQuery', function ($scope, $rootScope, $http, $anchorScroll, $timeout, $filter, enrollmentStepsService, enrollmentService, scrollService, jQuery) {
    $scope.stepsService = enrollmentStepsService;

    //Go ahead and set the first step to be utility for now
    //Need to determine how the first step will be activated
    //Or if we need to go ahead and activate multiple based on a saved card
    enrollmentStepsService.activateStep('utilityFlowService');
    enrollmentStepsService.activateStep('utilityFlowPlans');
    enrollmentStepsService.setStep('utilityFlowService');

    $scope.enrollment = {
        serverData: {}
    };

    /**
     * [enrollmentNavClick description]
     * @param  {[type]} step [description]
     * @return {[type]}      [description]
     */
    $scope.enrollmentNavClick = function(step) {
        if(step.isActive && step.isVisible) {
            enrollmentStepsService.setStep(step.name);
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

        return locationPromise = enrollmentService.getLocations(state, val).then(function (res) {
            var addresses = [];

            angular.forEach(res.data, function (item) {
                item.formattedAddress = $filter('address')(item.address);
                addresses.push(item);
            });

            return addresses;
        });
    };

    /**
     * Get the server data and populate the form
     */
    $scope.setServerData = function () {
        console.log('Setting initial server data:');

        var clientDataPromise = enrollmentService.getClientData();

        clientDataPromise.then(function (data) {
            $scope.enrollment.serverData = data;
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
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