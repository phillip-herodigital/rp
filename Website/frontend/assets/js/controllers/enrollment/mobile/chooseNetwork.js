ngApp.controller('MobileEnrollmentChooseNetworkCtrl', ['$scope', '$filter', '$modal', 'enrollmentService', 'enrollmentCartService', 'enrollmentStepsService', 'mobileEnrollmentService', function ($scope, $filter, $modal, enrollmentService, enrollmentCartService, enrollmentStepsService, mobileEnrollmentService) {

    var excludedStates = ['AK', 'HI', 'PR'];

    $scope.showNetworks = true;

    if (window.location.href.indexOf('sprintBuyPhone') > 0) {
        $scope.mobileEnrollmentSettings.sprintBuyPhone = true;
    }

    if (window.location.href.indexOf('sprintByod') > 0) {
        $scope.mobileEnrollmentSettings.sprintByod = true;
    }

    $scope.chooseNetwork = function(network, phoneType) {
        $scope.mobileEnrollment.phoneTypeTab = phoneType;
        mobileEnrollmentService.selectedNetwork = _.where($scope.mobileEnrollmentService.availableNetworks, { value: network })[0];
        $scope.completeStep();
    };

    $scope.$watch('mobileEnrollmentService.state', function (newValue, oldValue) {
        $scope.showNetworks = !_.contains(excludedStates, newValue);
    });

    /**
     * Complete the Choose Network Step
     * @return {[type]} [description]
     */
    $scope.completeStep = function () {  
        //enrollmentCartService.addService({ location: $scope.data.serviceLocation });
        enrollmentService.setChooseNetwork();
    };

}]);