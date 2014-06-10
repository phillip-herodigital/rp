/* Enrollment Main Controller
 * This is the main controller for Enrollments. It will keep track of the enrollment state, as well as all fields that will need to be collected.
 */
ngApp.controller('EnrollmentMainCtrl', ['$scope', '$rootScope', '$http', '$anchorScroll', '$timeout', '$filter', 'enrollmentService', 'scrollService', 'jQuery', function ($scope, $rootScope, $http, $anchorScroll, $timeout, $filter, enrollmentService, scrollService, jQuery) {

    $scope.enrollment = {
        serverData : {}, // This array should keep track of all the form fields we collect for the enrollment
        currentSection : 'serviceInformation',
        nextSection : true,
        extraFields : {},
        formErrors: {},
        currentAddress: {},
        headerHeightOffset: jQuery('header.site-header').height() * -1,
        sections : [
            {
                id: 'serviceInformation',
                name: 'Let\'s Get Started',
                order: 1,
                isVisible: true
            },
            {
                id: 'planSelection',
                name: 'Choose Your Plan',
                order: 2,
                isVisible: false
            },
            {
                id: 'accountInformation',
                name: 'Setup Your Account',
                order: 3,
                isVisible: false
            },
            {
                id: 'verifyIdentity',
                name: 'Verify Identity',
                order: 4,
                isVisible: false
            },
            {
                id: 'completeOrder',
                name: 'Confirm Order',
                order: 5,
                isVisible: false
            }
        ]
    };

    /**
    * Activate Sections
    *
    * @param string location
    */
    $scope.activateSections = function (location) {
        angular.forEach($scope.enrollment.sections, function (value) {
            if (value.id == location) {
                value.isVisible = true;
            }
        });

        $scope.enrollment.currentSection = location;

        //Delay needs to be set to allow angular code to open section.
        $timeout(function () {
            scrollService.scrollTo(location, $scope.enrollment.headerHeightOffset);
        }, 10); 
    };

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
    * Set Server Data
    */
    $scope.setServerData = function () {
        //TODO: Replace AJAX with static variable once available
        console.log('Setting initial server data:');

        var clientDataPromise = enrollmentService.getClientData();

        clientDataPromise.then(function (data) {
            $scope.enrollment.serverData = data;
            console.log(data);
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