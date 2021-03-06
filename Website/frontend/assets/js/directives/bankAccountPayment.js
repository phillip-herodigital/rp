﻿ngApp.directive('bankAccountPayment', ['$parse', function ($parse) {
    return {
        templateUrl: '/templates/new-bank-account',
        restrict: 'AEC',
        controller: ['$scope', function ($scope) {
            var ctrl = this;
            this.bankAccount = function () {
                var accountToken = ctrl.accountToken;
                return accountToken({ routingNumber: ctrl.routingNumber }).then(function (value) {
                    return {
                        paymentType: 'TokenizedBank',
                        name: ctrl.nameOnBank,
                        category: ctrl.category,
                        routingNumber: ctrl.routingNumber,
                        accountToken: value,
                        redactedData: accountToken.redacted
                    }
                });
            };
        }],
        scope: true,
        link: function ($scope, element, attrs, ctrl) {
            $scope.bankCtrl = ctrl;

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
            $parse(attrs['bankAccountPayment']).assign($scope, ctrl.bankAccount);

        }
    };
}]);