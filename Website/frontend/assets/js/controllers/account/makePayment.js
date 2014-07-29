/* Make a Payment Controller
 *
 */
ngApp.controller('MakePaymentCtrl', ['$scope', '$rootScope', '$http', '$modal', '$q', function ($scope, $rootScope, $http, $modal, $q) {

    var ctrl = this;
    this.invoices = null;
    this.paymentMethods = null;
    this.selectedAccounts = [];
    this.total = 0;
    this.overriddenWarnings = [];

    this.paymentMethod = function () {
        if (ctrl.useNewPaymentMethod) {
            return ctrl.newPaymentMethod[ctrl.newPaymentMethodType]();
        } else {
            var deferred = $q.defer();
            deferred.resolve(ctrl.selectedPaymentMethod);
            return deferred.promise;
        }
    }

    this.resolvePaymentMethod = function () {
        ctrl.paymentMethod().then(function (data) {
            ctrl.evaluatedPaymentMethod = data;
            ctrl.activeState = 'step2';
        });
    };

    this.makePayment = function () {

        $http.post('/api/account/makeMultiplePayments', {
            paymentAccount: ctrl.evaluatedPaymentMethod,
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
                ctrl.paymentAmount = 0.00;
                _.forEach(data.confirmations, function (account) {
                    _.find(ctrl.selectedAccounts, { accountNumber: account.accountNumber }).confirmationNumber = account.paymentConfirmationNumber
                    ctrl.paymentAmount += _.find(ctrl.selectedAccounts, { accountNumber: account.accountNumber }).invoiceAmount;
                });
            }
        });
    };

    $scope.$watch(function () { return _.pluck(ctrl.invoices.values, 'selected'); }, function (newValue) {
        ctrl.selectedAccounts = _.where(ctrl.invoices.values, { 'selected': true, 'canMakeOneTimePayment': true });
        ctrl.total = _.reduce(ctrl.selectedAccounts, function (a, b) { return a + parseFloat(b.invoiceAmount); }, 0);
        ctrl.paymentAmount = ctrl.total;
    }, true);

    // Disable weekends selection
    $scope.disableWeekends = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };
    ctrl.selectedDate = $scope.minDate = new Date();

    ctrl.activeState = 'step1';

}]);