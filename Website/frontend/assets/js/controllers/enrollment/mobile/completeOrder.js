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

    $scope.showSignatureModal = function (templateUrl) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl,
            'windowClass': 'signature',
            'controller': 'MobileEnrollmentCompleteOrderSignatureModalCtrl'
        })
    };

    $scope.signatureModal = {
        selectedTab: 'type',
        name: ''
    };

    $scope.selectTab = function(name) {
        $scope.signatureModal.selectedTab = name;
    };

    $scope.completeOrder = function() {
        $scope.setCurrentStep('order-confirmation');
    };

}]);

ngApp.controller('MobileEnrollmentCompleteOrderSignatureModalCtrl', ['$scope', '$modalInstance', 'mobileEnrollmentService', function ($scope, $modalInstance, mobileEnrollmentService) {

    $scope.submit = function () {
        $modalInstance.close();
    };

}]);