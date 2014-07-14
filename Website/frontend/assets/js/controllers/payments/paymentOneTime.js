/* 
	Payments - One Time Payment Controller
 */
ngApp.controller('PaymentsCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
	var ctrl = this;
	//Had to use the following since ng-value is used to not conflict with the value.js directive
	this.creditCard = 'credit-card';
	this.bankAccount = 'bank-account';
	this.activeStep = 1;

	this.back = function() {
		if(this.activeStep > 0) {
			this.activeStep--;
		}
	};

	//Step 1
	this.lookupAccount = function() {
		this.activeStep = 2;
	};

	//Step 2
	this.validatePaymentInfo = function() {
		this.activeStep = 3;
	};

	//Step 3
	this.submitPaymentInfo = function() {
		this.activeStep = 4;
	};

	//Step 4
	this.makeAnotherPayment = function() {
		$scope.activeStep = 1;
	};
}]);