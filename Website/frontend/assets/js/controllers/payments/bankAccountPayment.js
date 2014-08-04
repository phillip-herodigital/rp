ngApp.controller('BankAccountPaymentCtrl', ['$scope', '$q', function ($scope, $q) {
    var ctrl = this;
    this.bankAccount = function () {
        var deferred = $q.defer();
        deferred.resolve(function () {
            return {
                paymentType: 'BankPaymentMethod',
                category: ctrl.category,
                routingNumber: ctrl.routingNumber,
                accountNumber: ctrl.accountNumber,
                redactedData: "*******" + ctrl.accountNumber.slice(-4)
            };
        })
        return deferred.promise;
    };
}]);