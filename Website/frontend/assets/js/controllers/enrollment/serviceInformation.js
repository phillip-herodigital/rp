/* Enrollment Service Information Controller
 *
 * This is used to control aspects of let's get started on enrollment page.
 */
ngApp.controller('EnrollmentServiceInformationCtrl', ['$scope', '$rootScope', 'enrollmentService', function ($scope, $rootScope, enrollmentService) {
    /**
    * Get Locations
    */
    $scope.getLocation = function (val) {
        console.log('Getting locations...');

        var locationsPromise = enrollmentService.getLocations(val),
            addresses = [];

        locationsPromise.then(function (data) {
            angular.forEach(data.results, function (item) {
                addresses.push(item.formatted_address);
            });

            return addresses;
        }, function (data) {
            // error response
            $rootScope.$broadcast('connectionFailure');
        });

        return locationsPromise;
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