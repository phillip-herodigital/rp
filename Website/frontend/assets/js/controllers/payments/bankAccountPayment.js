ngApp.controller('BankAccountPaymentCtrl', ['$scope', function ($scope) {
    var ctrl = this;
    this.bankAccount = function () {
        return {
            paymentType: 'BankPaymentMethod',
            category: ctrl.category,
            routingNumber: ctrl.routingNumber,
            accountNumber: ctrl.accountNumber
        };
    };
}]);