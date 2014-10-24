ngApp.controller('MobileEnrollmentCompleteOrderCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

	/*$scope.completeOrder = {
        creditCard: {}
    };*/

    $scope.mobileEnrollmentService = mobileEnrollmentService;

    $scope.completeOrder = function() {
        $scope.setCurrentStep('order-confirmation');
    };

}]);