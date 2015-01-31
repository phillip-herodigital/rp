/* 
    Payments - One Time Payment Controller
 */
ngApp.controller('OneTimePaymentCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    var ctrl = this;
    this.activeStep = 1;
    ctrl.selectedDate = new Date();
    ctrl.overrideWarnings = [];

    this.paymentMethod = function () {
        return ctrl.newPaymentMethod[ctrl.newPaymentMethodType]();
    }

    this.back = function() {
        if(this.activeStep > 0) {
            this.activeStep--;
        }
    };
    $scope.isLoading = false;
    //Step 1
    this.lookupAccount = function () {
        $scope.isLoading = true;
        $http({
            method  : 'POST',
            url     : '/api/account/findAccountForOneTimePayment',
            data    : { 'accountNumber' : ctrl.accountNumber },
            headers : { 'Content-Type': 'application/JSON' } 
        })
            .success(function (data, status, headers, config) {
                $scope.isLoading = false;
                if (!data.success) {
                    ctrl.errorMessage = true;
                } else {
                    ctrl.account = data.account;
                    ctrl.paymentAmount = ctrl.account.amountDue;
                    ctrl.activeStep = 2;
                }
            });
    };

    //Step 2
    this.validatePaymentInfo = function () {
        $scope.isLoading = true;
        ctrl.paymentMethod().then(function (paymentMethod) {
            $scope.isLoading = false;
            if (paymentMethod.type == "Unknown" || _.some(ctrl.account.availablePaymentMethods, { 'paymentMethodType': paymentMethod.type })) {
                ctrl.evaluatedPaymentMethod = paymentMethod;
                ctrl.totalCharge = (ctrl.account.accountType != 'Mobile') ? (parseFloat(ctrl.paymentAmount) + 2.95) : parseFloat(ctrl.paymentAmount);
                ctrl.activeStep = 3;
            } else {
                $scope.validations = [{
                    "memberName": "PaymentAccount.CreditCardNumber"
                }];
            }
        });
    };

    //Step 3
    this.submitPaymentInfo = function () {
        $scope.isLoading = true;
        $http({
            method: 'POST',
            url: '/api/account/makeOneTimePayment',
            data: {
                'accountNumber': ctrl.accountNumber,
                'customerName': ctrl.name,
                'customerEmail': {
                    'address': ctrl.email
                },
                'paymentAccount': ctrl.evaluatedPaymentMethod,
                'totalPaymentAmount': ctrl.paymentAmount,
                'overrideWarnings': ctrl.overrideWarnings || []
            },
            headers: { 'Content-Type': 'application/JSON' }
        })
        .success(function (data) {
            $scope.isLoading = false;
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
        ctrl.activeStep = 1;
        ctrl.selectedDate = new Date();
        ctrl.accountNumber = null;
        ctrl.account = null;
    };
}]);