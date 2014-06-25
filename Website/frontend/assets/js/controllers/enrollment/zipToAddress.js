ngApp.controller('EnrollmentZipToAddressCtrl', ['$scope', '$modalInstance', 'utilityProductsService', function ($scope, $modalInstance, utilityProductsService) {
    this.selectedLocation = angular.copy($scope.currentLocationInfo().location);
    this.serviceState = $scope.currentLocationInfo().location.address.stateAbbreviation;
    this.loadingServiceAddress = false;

    this.save = function () {
        console.log(this.selectedLocation);
        utilityProductsService.addOrUpdateAddress({ location: this.selectedLocation });
        $modalInstance.close();
    };
}]);