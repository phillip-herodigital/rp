/* 
	Payments - One Time Payment Controller
 */
ngApp.controller('PaymentsCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
	//Had to use the following since ng-value is used to not conflict with the value.js directive
	$scope.creditCard = 'credit-card';
	$scope.bankAccount = 'bank-account';
	$scope.activeState = 'step1';

	$scope.continue = function() {
		$scope.activeState = 'step2';
	}
}]);