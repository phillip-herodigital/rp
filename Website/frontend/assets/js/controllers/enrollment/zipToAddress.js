ngApp.controller('EnrollmentZipToAddressCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
    this.selectedLocation = angular.copy($scope.currentLocationInfo().location);
    this.serviceState = $scope.currentLocationInfo().location.address.stateAbbreviation;
    this.loadingServiceAddress = false;

    // create a filter so that the same phone type can't be selected twice
    this.addressFilter = function(item){
        return (item.address.line1 != '');
    };

    this.save = function () {
        var target = _($scope.currentLocationInfo().location.capabilities).find({ capabilityType: "ServiceStatus" });

        this.selectedLocation.capabilities.push({ "capabilityType": "ServiceStatus", "enrollmentType": target.enrollmentType });
        this.selectedLocation.capabilities.push(_($scope.currentLocationInfo().location.capabilities).find({ capabilityType: "CustomerType" }));
        $scope.currentLocationInfo().location = this.selectedLocation;
        $modalInstance.close();
    };
}]);