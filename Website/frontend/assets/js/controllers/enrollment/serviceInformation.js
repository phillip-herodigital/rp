/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$rootScope', '$http', 'enrollmentService', function ($scope, $rootScope, $http, enrollmentService) {
    $scope.extraFields.isNewService = 0;
    $scope.extraFields.serviceState = 'TX';

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
    */
    $scope.getLocation = function (state, val) {
        console.log('Getting locations...');

        return locationPromise = enrollmentService.getLocations(state, val).then(function (res) {
            var addresses = [];

            angular.forEach(res.data, function (item) {
                var address = item.address,
                    formattedAddress = '';

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

                item.formattedAddress = formattedAddress;

                addresses.push(item);
            });

            return addresses;
        });
    };

    /**
    * Complete Enrollment Section
    */
    $scope.completeStep = function () {
        /*
        var locationObject = {
            "address":{"postalCode5":"75010"},
            "capabilities": [
                {"esiId": "1234SAMPLE5678","tdu": "Centerpoint","capabilityType":"TexasElectricity"},
                {"capabilityType":"ServiceStatus", "isNewService": true}
            ]
        };
        */

        console.log('Sending service information...');

        var serviceInformationPromise = enrollmentService.setServiceInformation();

        serviceInformationPromise.then(function (data) {
            console.log(data);
            $scope.serverData = data;
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });
    };

}]);