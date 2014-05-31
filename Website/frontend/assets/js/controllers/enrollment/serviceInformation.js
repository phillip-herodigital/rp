/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$rootScope', '$http', '$location', '$anchorScroll', 'enrollmentService', function ($scope, $rootScope, $http, $location, $anchorScroll, enrollmentService) {
    $scope.extraFields.isNewService = 0;
    $scope.extraFields.serviceState = 'TX';
    $scope.formErrors.serviceInformation = [];

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
        $scope.formErrors.serviceInformation = [];

        if (!$scope.extraFields.serviceAddress) {
            $scope.formErrors.serviceInformation.serviceAddress = 'Service Address required.';
            return;
        }

        if (typeof $scope.serverData.locationServices == 'undefined') {
            var data = { 'locations': {} };
        } else {
            var data = { 'locations': $scope.serverData.locationServices };
        }

        var id = $scope.createLocationID();
        data.locations[id] = {
            'location': $scope.extraFields.serviceAddress
        }

        if ($scope.extraFields.isNewService == 1) {
            data.locations[id].location.capabilities.push({ "capabilityType": "ServiceStatus", "isNewService": true });
        }

        console.log('Sending service information...');

        var serviceInformationPromise = enrollmentService.setServiceInformation(data);

        serviceInformationPromise.then(function (data) {
            angular.copy(data, $scope.serverData);

            $scope.extraFields.isNewService = 0;
            $scope.extraFields.serviceAddress = null;

            $scope.activateSections();

            $location.hash('planSelection');
            $anchorScroll();

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

        if (typeof $scope.serverData.locationServices == 'undefined') {
            return idPrefix + i;
        } else {
            while (typeof $scope.serverData.locationServices[idPrefix + i] != 'undefined') {
                i++;
            }
        }

        return idPrefix + i;
    };

}]);