ngApp.controller('EnrollmentZipToAddressCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
    this.selectedLocation = angular.copy($scope.currentLocationInfo().location);
    this.serviceState = $scope.currentLocationInfo().location.address.stateAbbreviation;
    this.loadingServiceAddress = false;

    this.save = function () {
        var target = _($scope.currentLocationInfo().location.capabilities).find({ capabilityType: "ServiceStatus" });

        this.selectedLocation.capabilities.push({ "capabilityType": "ServiceStatus", "enrollmentType": target.enrollmentType, "customerType": 'residential' });
        $scope.currentLocationInfo().location = this.selectedLocation;
        $modalInstance.close();
    };
}]);