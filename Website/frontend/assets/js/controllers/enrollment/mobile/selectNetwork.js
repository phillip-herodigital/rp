ngApp.controller('MobileEnrollmentSelectNetworkCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.availableNetworks = [];
    var excludedStates = ['AK', 'HI'];

    $scope.updateAvailableNetworks = function(state) {
        //Grab the available networks here, for now return the only two we have
        if (_.contains(excludedStates, state)) {
            $scope.availableNetworks = [];
        } else {
            $scope.availableNetworks = ['att', 'sprint'];
        }
    };

    $scope.chooseNetwork = function(network, phoneType) {
        $scope.phoneFilters.selectedNetwork = network;
        $scope.phoneFilters.phoneTypeTab = phoneType;
        $scope.currentStep = 'choose-phone';
    };

    $scope.isAvailableNetwork = function(network) {
        return _.indexOf($scope.availableNetworks, network) > -1;
    };

    $scope.$watch('mobileFields.state', function (newValue, oldValue) {
        console.log(newValue);
        $scope.updateAvailableNetworks(newValue);
    });

}]);