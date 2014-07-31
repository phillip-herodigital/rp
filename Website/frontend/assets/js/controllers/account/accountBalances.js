/* Account Balances and Payments Controller
 *
 */
ngApp.controller('AcctBalancesAndPaymentsCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
	
	var ctrl = this;
    this.invoices = null;
    this.paymentMethods = null;
    this.selectedAccount = null;
    this.total = 0;
    this.overriddenWarnings = [];

    this.paymentMethod = function () {
        if (ctrl.useNewPaymentMethod) {
            return ctrl.newPaymentMethod[ctrl.newPaymentMethodType]();
        } else {
            return ctrl.selectedPaymentMethod;
        }
    }

    this.makePayment = function () {
        $http.post('/api/account/makeMultiplePayments', {
            paymentAccount: ctrl.paymentMethod(),
            accountNumbers: _.pluck(ctrl.selectedAccounts, 'accountNumber'),
            totalPaymentAmount: ctrl.paymentAmount,
            paymentDate: ctrl.selectedDate,
            overrideWarnings: ctrl.overriddenWarnings
        }).success(function (data) {
            if (data.blockingAlertType) {

                $modal.open({
                    templateUrl: 'PaymentBlockingAlert/' + data.blockingAlertType,
                    scope: $scope
                }).result.then(function () {
                    ctrl.overriddenWarnings.push(data.blockingAlertType);
                    ctrl.makePayment();
                });

            } else {
                ctrl.activeState = 'step3';
                if (ctrl.selectedAccounts.length != 1) {
                    ctrl.paymentAmount = 0.00;
                }
                _.forEach(data.confirmations, function (account) {
                    _.find(ctrl.selectedAccounts, { accountNumber: account.accountNumber }).confirmationNumber = account.paymentConfirmationNumber
                    ctrl.paymentAmount += ctrl.selectedAccounts.length != 1 ? _.find(ctrl.selectedAccounts, { accountNumber: account.accountNumber }).invoiceAmount : 0;
                });
            }
        });
    };

    ctrl.activeState = 'step1';

}]);