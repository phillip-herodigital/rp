ngApp.controller('MobileEnrollmentCompleteOrderCtrl', ['$scope', '$filter', '$modal', 'mobileEnrollmentService', function ($scope, $filter, $modal, mobileEnrollmentService) {

    $scope.mobileEnrollmentService = mobileEnrollmentService;
    $scope.cart = $scope.mobileEnrollmentService.getCart();
    $scope.isBreakdownShown = false;

    $scope.accountInformation = {
        shippingAddressSame: true
    };

    $scope.businessInformation = {
        businessAddressSame: true,
        signatory: true
    };

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
        var signatureModalInstance = $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl,
            'windowClass': 'signature',
            'controller': 'MobileEnrollmentCompleteOrderSignatureModalCtrl'
        });
        signatureModalInstance.result.then(function (signature) {
            $scope.businessInformation.signature = signature;
        });
    };

    $scope.completeOrder = function() {
        $scope.setCurrentStep('order-confirmation');
    };

}]);

ngApp.controller('MobileEnrollmentCompleteOrderSignatureModalCtrl', ['$scope', '$modalInstance', 'mobileEnrollmentService', function ($scope, $modalInstance, mobileEnrollmentService) {

    $scope.selectedTab = 'type';
    $scope.formData = {
        name: ''
    };

    $scope.selectTab = function(name) {
        $scope.selectedTab = name;
    };

    $scope.submit = function () {
        $modalInstance.close($scope.formData.name);
    };

}]);