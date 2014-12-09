/* Enrollment Main Controller
 * This is the main controller for Enrollments. It will keep track of the enrollment state, as well as all fields that will need to be collected.
 */
ngApp.controller('EnrollmentMainCtrl', ['$scope', '$anchorScroll', 'enrollmentStepsService', 'enrollmentService', 'scrollService', '$timeout', 'enrollmentCartService', '$filter', function ($scope, $anchorScroll, enrollmentStepsService, enrollmentService, scrollService, $timeout, enrollmentCartService, $filter) {
    $scope.validations = enrollmentService.validations;
    $scope.stepsService = enrollmentStepsService;
    $scope.customerType = 'residential';
    $scope.cartLocationsCount = 0;
    $scope.isCartFull = false;
    $scope.isLoading = enrollmentService.isLoading;

    $scope.$watch(function () { return enrollmentService.isLoading; }, function (newValue) {
        $scope.isLoading = newValue;
    });

    //Go ahead and set the first step to be utility for now
    //Need to determine how the first step will be activated
    //Or if we need to go ahead and activate multiple based on a saved card
    enrollmentStepsService.setInitialFlow('utility');

    $scope.setTimeRemaining = enrollmentStepsService.setTimeRemaining;

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
    * @param string state        //State abbreviation
    * @param string val          //Search string value
    */
    $scope.getLocation = function (state, val, zipOnly) {
        return enrollmentService.getLocations(state, $scope.customerType, val).then(function (res) {
            return _.filter(res.data, function (value) {
                if (zipOnly && value.address.line1 == null) return false;
                // This got a bit more complex when I decided that when "editing" an address you should be able to type back in the original address.
                return true;
            })
        });
    };

    $scope.isDuplicateAddress = function (address) {
        var activeService = enrollmentCartService.getActiveService();
        if (activeService && $filter('address')(address) == $filter('address')(activeService.location.address)) {
            return false;
        }
        
        return enrollmentCartService.findMatchingAddress(address);
    };

    /**
     * Get the server data and populate the form
     */
    $scope.setServerData = function (serverData) {
        enrollmentService.setClientData(serverData);
        $scope.isRenewal = enrollmentService.isRenewal;
        if (!serverData.isLoading) {
            $timeout(function () {
                enrollmentStepsService.setFromServerStep(serverData.expectedState);
            });
        }
        if (_(serverData.cart).some(function (e) {
            return _(e.location.capabilities).some({ capabilityType: 'CustomerType', customerType: 'commercial' });
        })) {
            $scope.customerType = 'commercial';
        }
    };

    $scope.assignStepNames = function (navTitles) {
        if ($scope.customerType == 'commercial') {
            navTitles.utilityFlowPlans = navTitles.utilityFlowPlansCommercial;
        }
        angular.forEach(navTitles, function (translation, stepId) {
            var step = enrollmentStepsService.getStep(stepId);
            if (step){
                step.name = translation;
            }
        });
    };

    $scope.assignSupportedUtilityStates = function (supportedStates) {
        var availableStates = _.filter(supportedStates, function(state){return state.abbreviation == 'TX' || state.abbreviation == 'GA'; });
        $scope.supportedUtilityStates = _(availableStates).map(function (entry) { return { name: entry.display, value: entry.abbreviation, 'class': 'icon ' + entry.css } }).value();
    };

    $scope.assignEnrollmentDefaultState = function (state) {
        if ($scope.data == null) {
            $scope.data = {};
        }
        $scope.data.serviceState = state;
    };

    $scope.resetEnrollment = function () {
        enrollmentService.resetEnrollment();
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