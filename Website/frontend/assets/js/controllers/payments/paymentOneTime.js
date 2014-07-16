/* 
	Payments - One Time Payment Controller
 */
ngApp.controller('OneTimePaymentCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
	var ctrl = this;
	this.activeStep = 1;
	ctrl.overrideWarnings = [];

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
	};

	//Step 2
	this.validatePaymentInfo = function() {
		this.activeStep = 3;
	};

	//Step 3
	this.submitPaymentInfo = function () {
	    $http({
	        method: 'POST',
	        url: '/api/account/makeOneTimePayment',
	        data: {
	            'accountNumber': ctrl.accountNumber,
                'customerName':        ctrl.name,
                'customerEmail': {
                    'address': ctrl.email
                },
	            'paymentAccount': ctrl.paymentMethod(),
                'totalPaymentAmount': ctrl.totalPaymentAmount,
                'overrideWarnings': ctrl.overrideWarnings || []
	        },
	        headers: { 'Content-Type': 'application/JSON' }
	    })
        .success(function (data) {
            if (data.blockingAlertType) {
                // TODO - either display the alerts or change server-side code to not check for them.
                ctrl.overrideWarnings.push(data.blockingAlertType);
                ctrl.submitPaymentInfo();
            } else {
                ctrl.confirmationNumber = data.confirmation.paymentConfirmationNumber;
                ctrl.activeStep = 4;
            }            
        });
	};

	//Step 4
	this.makeAnotherPayment = function() {
		this.activeStep = 1;
		this.accountNumber = null;
		this.account = null;
	};
}]);