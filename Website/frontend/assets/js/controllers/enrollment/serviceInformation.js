/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$rootScope', '$http', '$location', '$filter', 'enrollmentService', function ($scope, $rootScope, $http, $location, $filter, enrollmentService) {
    $scope.serviceInformation = {
        serviceState: 'TX',
        currentAddress: {},
        isNewService: -1
    };

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
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        var postData = {};

        //If duplicate serviceAddress, show validation error
        if ($scope.checkDuplicateLocation($scope.enrollment.serviceAddress)) {
            $scope.enrollment.form.serviceInformation.serviceAddress = 'Service Address already added to cart.';
            return;
        }

        //Setup our location object to be saved
        postData = $scope.createLocationPostObject($scope.enrollment.uiModel.enrollmentLocations, $scope.enrollment.serviceAddress);
      
        //Save the updated locations
        var serviceInformationPromise = enrollmentService.setServiceInformation(postData);

        serviceInformationPromise.then(function (data) {
            //Let's set the server data again to make sure it's up-to-date
            $scope.enrollment.serverData = data;
            $scope.serviceInformation.isNewService = 0;

            //Change this line to real ID in acutal implementation
            //$scope.enrollment.serviceAddress.id = id;
            $scope.serviceInformation.serviceAddress.id = 'location1';

            //Loop through the returned enrollmentLocations and find the current service address
            //Set currentAddress to that item
            angular.forEach(data.enrollmentLocations, function (item, id) {
                if(item.id == $scope.serviceAddress.id) {
                    $scope.currentAddress = item;
                    $scope.currentLocation = item.id;
                }
            });

            //Remove the current service address so another can be added
            $scope.serviceAddress = null;

            //Move to the next section
            $scope.activateSections('planSelection');
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

    $scope.createLocationPostObject = function(existingLocations, newLocation) {
        //Create our empty locations object
        var data = { 'locations':{} };

        angular.forEach(existingLocations, function (item, id) {
            data.locations[item.id] = item.location;
        });

        //If this is a new service setup, add that to the capabilities object
        if ($scope.serviceInformation.isNewService == 1) {
            newLocation.capabilities.push({ "capabilityType": "ServiceStatus", "isNewService": true });
        }        

        //Add the new location to be saved and create a new ID for it
        //formattedAddress is on this object, we might need to remove it
        data.locations[$scope.createLocationID()] = newLocation;

        return data;
    };

    /**
    * Create location ID
    * return string
    */
    $scope.createLocationID = function () {
        var i = 1,
            idPrefix = 'location';

        if (typeof $scope.enrollment.uiModel.enrollmentLocations == 'undefined') {
            return idPrefix + i;
        } else {
            while (typeof $scope.enrollment.uiModel.enrollmentLocations[idPrefix + i] != 'undefined') {
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
                if ($filter('address')(value.location.address) == location.formattedAddress) {
                    duplicateLocation = true;
                }
            });
        }
        return duplicateLocation;
    };
}]);