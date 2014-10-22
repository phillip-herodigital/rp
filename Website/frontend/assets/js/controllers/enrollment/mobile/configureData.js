ngApp.controller('MobileEnrollmentConfigureDataCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.setDataPlan = function() {
        $scope.setCurrentStep('complete-order');
    };

}]);