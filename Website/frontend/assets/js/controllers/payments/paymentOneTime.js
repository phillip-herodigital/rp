/* 
	Payments - One Time Payment Controller
 */
ngApp.controller('PaymentsCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
	//Had to use the following since ng-value is used to not conflict with the value.js directive
	$scope.creditCard = 'credit-card';
	$scope.bankAccount = 'bank-account';
	$scope.activeStep = 1;

	$scope.back = function() {
		if($scope.activeStep > 0) {
			$scope.activeStep--;
		}
	};

	//Step 1
	$scope.lookupAccount = function() {
		$scope.activeStep = 2;
	};

	//Step 2
	$scope.validatePaymentInfo = function() {
		$scope.activeStep = 3;
	};

	//Step 3
	$scope.submitPaymentInfo = function() {
		$scope.activeStep = 4;
	};

	$scope.makeAnotherPayment = function() {
		$scope.activeStep = 1;
	};
}]);