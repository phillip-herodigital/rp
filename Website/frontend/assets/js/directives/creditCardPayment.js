ngApp.directive('creditCardPayment', ['$parse', function ($parse) {
    return {
        templateUrl: '/templates/new-credit-card',
        restrict: 'AEC',
        controller: ['$scope', function ($scope) {
            var ctrl = this;
            this.validate = true;
            this.tokenizedCard = function () {
                var cardToken = ctrl.cardToken;
                return cardToken().then(function (value) {
                    return {
                        paymentType: 'TokenizedCard',
                        cardToken: value,
                        expirationDate: new Date(ctrl.expirationYear, ctrl.expirationMonth),
                        name: ctrl.nameOnCard,
                        billingZipCode: ctrl.billingZip,
                        securityCode: ctrl.securityCode,
                        redactedData: cardToken.redacted
                    };
                });
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
        }],
        scope: true,
        link: function ($scope, element, attrs, ctrl) {
            $scope.ccCtrl = ctrl;

            function twoWay(attrName, ctrlValue) {
                if (!attrs[attrName])
                    return;
                var parsed = $parse(attrs[attrName]);
                $scope.$watch(parsed, function (newValue) {
                    ctrl[ctrlValue] = newValue;
                });
                $scope.$watch(function () { return ctrl[ctrlValue]; }, function (newValue) {
                    if (parsed.assign) {
                        parsed.assign($scope, newValue);
                    }
                });
            }

            twoWay('valIf', 'validate');
            $parse(attrs['creditCardPayment']).assign($scope, ctrl.tokenizedCard);

        }
    };
}]);