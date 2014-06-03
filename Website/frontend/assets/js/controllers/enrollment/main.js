/* Enrollment Main Controller
 * This is the main controller for Enrollments. It will keep track of the enrollment state, as well as all fields that will need to be collected.
 */
ngApp.controller('EnrollmentMainCtrl', ['$scope', '$rootScope', '$http', '$anchorScroll', 'enrollmentService', 'scrollService', function ($scope, $rootScope, $http, $anchorScroll, enrollmentService, scrollService) {

    $scope.enrollment = {
        serverData : {}, // This array should keep track of all the form fields we collect for the enrollment
        currentSection : 'serviceInformation',
        nextSection : true,
        extraFields : {},
        formErrors : {},
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
            if (typeof $scope.enrollment.serverData.locationServices != 'undefined') {
                if (value.id == 'serviceInformation' || value.id == 'planSelection')
                value.isVisible = true;
            }
        });

        $scope.enrollment.currentSection = location;

        //Delay needs to be set to allow angular code to open section.
        setTimeout(function () {
            scrollService.scrollTo(location);
        }, 10); 
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
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

    /**
    * Format address object
    *
    * @param object address
    *
    * return string
    */
    $scope.formatAddress = function (address) {
        var formattedAddress = '';

        if (address.line1) {
            formattedAddress += address.line1 + ', ';
        }

        if (address.unitNumber) {
            formattedAddress += address.unitNumber + ', ';
        }

        if (address.city) {
            formattedAddress += address.city + ', ';
        }

        if (address.stateAbbreviation) {
            formattedAddress += address.stateAbbreviation + ', ';
        }

        if (address.postalCode5) {
            formattedAddress += address.postalCode5;
            if (address.postalCodePlus4) {
                formattedAddress += '-' + address.postalCode5;
            }
        }

        return formattedAddress;
    };
}]);