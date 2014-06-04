/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$rootScope', '$http', '$location', 'enrollmentService', function ($scope, $rootScope, $http, $location, enrollmentService) {
    $scope.enrollment.extraFields.isNewService = 0;
    $scope.enrollment.extraFields.serviceState = 'TX';
    $scope.enrollment.formErrors.serviceInformation = [];

    $scope.states = [
        {
            'class': 'icon texas',
            'name': 'Texas',
            'value': 'TX'
        },
        {
            'class': 'icon georgia',
            'name': 'Georgia',
            'value': 'GA'
        },
        {
            'class': 'icon pennsylvania',
            'name': 'Pennsylvania',
            'value': 'PA'
        },
        {
            'class': 'icon maryland',
            'name': 'Maryland',
            'value': 'MD'
        },
        {
            'class': 'icon new-jersey',
            'name': 'New Jersey',
            'value': 'NJ'
        },
        {
            'class': 'icon new-york',
            'name': 'New York',
            'value': 'NY'
        },
        {
            'class': 'icon washington-dc',
            'name': 'Washington, DC',
            'value': 'DC'
        }
    ];

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
                item.formattedAddress = $scope.formatAddress(item.address);
                addresses.push(item);
            });

            return addresses;
        });
    };

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        $scope.enrollment.formErrors.serviceInformation = [];

        /* Editing out error checking
        if (!$scope.enrollment.extraFields.serviceAddress) {
            $scope.enrollment.formErrors.serviceInformation.serviceAddress = 'Service Address required.';
            return;
        }

        if ($scope.checkDuplicateLocation($scope.enrollment.extraFields.serviceAddress)) {
            $scope.enrollment.formErrors.serviceInformation.serviceAddress = 'Service Address already added to cart.';
            return;
        }
        */

        if (typeof $scope.enrollment.serverData.locationServices == 'undefined') {
            var data = { 'locations': {} };
        } else {
            var data = { 'locations': $scope.enrollment.serverData.locationServices };
        }

        var id = $scope.createLocationID();
        data.locations[id] = {
            'location': $scope.enrollment.extraFields.serviceAddress
        }

        if ($scope.enrollment.extraFields.isNewService == 1) {
            data.locations[id].location.capabilities.push({ "capabilityType": "ServiceStatus", "isNewService": true });
        }

        console.log('Sending service information...');

        var serviceInformationPromise = enrollmentService.setServiceInformation(data);

        serviceInformationPromise.then(function (data) {
            $scope.enrollment.serverData = data;

            $scope.enrollment.extraFields.isNewService = 0;

            angular.copy($scope.enrollment.extraFields.serviceAddress, $scope.enrollment.currentAddress);

            $scope.enrollment.extraFields.serviceAddress = null;

            $scope.activateSections('planSelection');

        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

    /**
    * Create location ID
    * return string
    */
    $scope.createLocationID = function () {
        var i = 1,
            idPrefix = 'location';

        if (typeof $scope.enrollment.serverData.locationServices == 'undefined') {
            return idPrefix + i;
        } else {
            while (typeof $scope.enrollment.serverData.locationServices[idPrefix + i] != 'undefined') {
                i++;
            }
        }

        return idPrefix + i;
    };

    /**
    * Check for duplicate location
    * @param {object} location
    *
    * return {string}
    */
    $scope.checkDuplicateLocation = function (location) {
        var duplicateLocation = false;
        if (typeof $scope.enrollment.serverData.locationServices != 'undefined') {
            angular.forEach($scope.enrollment.serverData.locationServices, function (value, key) {
                if ($scope.formatAddress(value.location.address) == location.formattedAddress) {
                    duplicateLocation = true;
                }
            });
        }
        return duplicateLocation;
    };
}]);