/* Make a Payment Controller
 *
 */
ngApp.controller('MakePaymentCtrl', ['$scope', '$rootScope', '$http', '$modal', function ($scope, $rootScope, $http, $modal) {

    var ctrl = this;
    this.invoices = null;
    this.paymentMethods = null;
    this.selectedAccounts = [];
    this.total = 0;
    this.overriddenWarnings = [];

    this.makePayment = function () {
        $http.post('/api/account/makePayment', {
            paymentAccount: ctrl.selectedPaymentMethod,
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
                ctrl.activeState = 'step3'
                _.forEach(data.confirmations, function (account) {
                    _.find(ctrl.selectedAccounts, { accountNumber: account.accountNumber }).confirmationNumber = account.paymentConfirmationNumber
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