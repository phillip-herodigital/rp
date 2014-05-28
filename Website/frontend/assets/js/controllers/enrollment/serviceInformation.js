/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$rootScope', '$http', 'enrollmentService', function ($scope, $rootScope, $http, enrollmentService) {
    $scope.extraFields.isNewService = 0;

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
    $scope.getLocation = function (val) {
        console.log('Getting locations...');

        //TODO: Will need to check state model from either serverData or pass in via getLocation function.  Need to convert select to custom dropdown

        return locationPromise = enrollmentService.getLocations(val).then(function (res) {
            var addresses = [];
            angular.forEach(res.data.results, function (item) {
                addresses.push(item.formatted_address);
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