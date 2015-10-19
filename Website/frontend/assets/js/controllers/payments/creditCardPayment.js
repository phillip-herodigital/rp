ngApp.controller('CreditCardPaymentCtrl', ['$scope', function ($scope) {
    var ctrl = this;
    this.tokenizedCard = function () {
        return {
            paymentType: 'TokenizedCard',
            cardToken: ctrl.cardToken(),
            expirationDate: new Date(ctrl.expirationYear, ctrl.expirationMonth),
            billingZipCode: ctrl.billingZip,
            securityCode: ctrl.securityCode,
            redactedData: ctrl.cardToken.redacted,
            type: ctrl.cardToken.type
        };
    };

    var currentYear = new Date().getFullYear();

    $scope.$watch(function () { return ctrl.expirationYear }, function (newValue) {
        if (newValue == currentYear) {
            ctrl.expirationMonths = _.range(new Date().getMonth() + 1, 13).map(function (n) { return String("0" + n).slice(-2); });
        } else {
            ctrl.expirationMonths = _.range(1, 13).map(function (n) { return String("0" + n).slice(-2); });
        }
    });
    $scope.$watch(function () { return ctrl.expirationMonth }, function (newValue) {
        if (newValue && newValue <= new Date().getMonth()) {
            ctrl.expirationYears = _.range(currentYear + 1, currentYear + 20);
        } else {
            ctrl.expirationYears = _.range(currentYear, currentYear + 20);
        }
    });
}]);