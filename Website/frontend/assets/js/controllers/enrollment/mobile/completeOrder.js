ngApp.controller('MobileEnrollmentCompleteOrderCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.completeOrder = function() {
        $scope.setCurrentStep('order-confirmation');
    };

}]);