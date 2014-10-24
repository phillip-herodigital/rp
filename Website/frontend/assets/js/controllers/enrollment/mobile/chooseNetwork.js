ngApp.controller('MobileEnrollmentChooseNetworkCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;

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
        $scope.mobileEnrollment.phoneTypeTab = phoneType;
        $scope.mobileEnrollmentService.selectedNetwork = network;
        $scope.setCurrentStep('choose-phone');
    };

    $scope.isAvailableNetwork = function(network) {
        return _.indexOf($scope.availableNetworks, network) > -1;
    };

    $scope.$watch('mobileEnrollmentService.state', function (newValue, oldValue) {
        $scope.updateAvailableNetworks(newValue);
    });

}]);