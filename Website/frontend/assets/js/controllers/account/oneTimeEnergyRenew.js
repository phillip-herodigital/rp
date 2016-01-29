﻿/*
    One time energy contract renewal
*/
ngApp.controller('OneTimeRenewalCtrl', ['$scope', '$http', '$timeout', '$location', function ($scope, $http, $timeout, $location) {
    var ctrl = this;
    ctrl.overrideWarnings = [];

    $scope.isLoading = false;
    $scope.streamConnectError = false;

    ctrl.lookupAccount = function () {
        ctrl.renewErrorMessage = false;
        ctrl.accountErrorMessage = false;
        ctrl.isCommercialTXMessage = false;
        ctrl.isCommercialGAMessage = false;
        ctrl.isOtherCommericalMessage = false;
        var accountData = {
            'AccountNumber': ctrl.accountNumber,
            'Last4': ctrl.last4SSN
        };
        $scope.isLoading = true;
        $http.post('/api/account/setupAnonymousRenewal', accountData)
                .success(function (data) {
                    if (data.success) {
                        if (data.availableForRenewal) {
                            if (data.isCommercial) {
                                ctrl.accountNumber = '';
                                ctrl.last4SSN = '';
                                $scope.validations = [];
                                if (data.state == "TX") {
                                    ctrl.isCommercialTXMessage = true;
                                    $scope.isLoading = false;
                                }
                                if (data.state == "GA") {
                                    ctrl.isCommercialGAMessage = true;
                                    $scope.isLoading = false;
                                }
                                if (data.state == "") {
                                    ctrl.isOtherCommericalMessage = true;
                                    $scope.isLoading = false;
                                }
                            }
                            else {
                                if (data.texasOrGeorgia) {
                                    window.location.assign('/enrollment?renewal=true&renewalType=anon');
                                }
                                else {
                                    $scope.isLoading = false;
                                    ctrl.TXorGAErrorMessage = true;
                                }
                            }
                        }
                        else {
                            $scope.isLoading = false;
                            ctrl.renewErrorMessage = true;
                        }
                    }
                    else {
                        $scope.isLoading = false;
                        ctrl.accountErrorMessage = true;
                    }
                })
                .error(function (error) {
                    $scope.isLoading = false;
                    $scope.streamConnectError = true;
                });
    }
}]);