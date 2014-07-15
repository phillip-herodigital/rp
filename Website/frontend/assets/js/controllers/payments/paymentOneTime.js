/* 
	Payments - One Time Payment Controller
 */
ngApp.controller('OneTimePaymentCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
	var ctrl = this;
	this.activeStep = 1;

	this.paymentMethod = function () {
	    return ctrl.newPaymentMethod[ctrl.newPaymentMethodType]();
	}

	this.back = function() {
		if(this.activeStep > 0) {
			this.activeStep--;
		}
	};

	//Step 1
	this.lookupAccount = function() {
		$timeout(function () {
			$http({
				method  : 'POST',
				url     : '/api/account/findAccountForOneTimePayment',
				data    : { 'accountNumber' : ctrl.accountNumber },
				headers : { 'Content-Type': 'application/JSON' } 
			})
				.success(function (data, status, headers, config) {
				    ctrl.account = data.account;
				    ctrl.totalPaymentAmount = ctrl.account.invoiceAmount;
					ctrl.activeStep = 2;
				});
		}, 800);
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
		this.activeStep = 1;
		this.accountNumber = null;
		this.account = null;
	};
}]);