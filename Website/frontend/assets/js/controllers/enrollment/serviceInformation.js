/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$rootScope', '$http', 'enrollmentService', function ($scope, $rootScope, $http, enrollmentService) {
    /**
    * Get Locations
    */
    $scope.getLocation = function (val) {
        console.log('Getting locations...');

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