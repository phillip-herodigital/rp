ngApp.controller('MobileEnrollmentChooseNetworkCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    var excludedStates = ['AK', 'HI', 'PR'];

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.showNetworks = true;

    if (window.location.href.indexOf('sprintBuyPhone') > 0) {
        $scope.mobileEnrollmentSettings.sprintBuyPhone = true;
    }

    if (window.location.href.indexOf('sprintByod') > 0) {
        $scope.mobileEnrollmentSettings.sprintByod = true;
    }

    /*$scope.updateAvailableNetworks = function(state) {
        //Grab the available networks here, for now return the only two we have
        if (_.contains(excludedStates, state)) {
            $scope.availableNetworks = [];
        } else {
            $scope.availableNetworks = ['att', 'sprint'];
        }
    };*/

    $scope.chooseNetwork = function(network, phoneType) {
        $scope.mobileEnrollment.phoneTypeTab = phoneType;
        $scope.mobileEnrollmentService.selectedNetwork = _.where($scope.mobileEnrollmentService.availableNetworks, { value: network })[0];;
        $scope.setCurrentStep('choose-phone');
    };

    /*$scope.isAvailableNetwork = function(network) {
        return _.indexOf($scope.mobileEnrollmentService.availableNetworks, network) > -1;
    };*/

    $scope.$watch('mobileEnrollmentService.state', function (newValue, oldValue) {
        //$scope.updateAvailableNetworks(newValue);
        $scope.showNetworks = !_.contains(excludedStates, newValue);
    });

}]);