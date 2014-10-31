ngApp.controller('MobileEnrollmentCompleteOrderCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.cart = $scope.mobileEnrollmentService.getCart();

    $scope.isBreakdownShown = false;

    $scope.toggleBreakdown = function() {
		$scope.isBreakdownShown = !$scope.isBreakdownShown;    	
    };

    $scope.editDevice = function() {
    	$scope.setCurrentStep('choose-phone');
    };

    $scope.editPlan = function() {
    	$scope.setCurrentStep('configure-data');
    };

    $scope.completeOrder = function() {
        $scope.setCurrentStep('order-confirmation');
    };

}]);