/*
    One time energy contract renewal
*/
ngApp.controller('OneTimeRenewalCtrl', ['$scope', '$http', '$timeout', '$location', function ($scope, $http, $timeout, $location) {
    var ctrl = this;
    ctrl.overrideWarnings = [];

    $scope.isLoading = true;
    $scope.streamConnectError = false;

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(window.location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    ctrl.lookupAccount = function () {
        ctrl.renewErrorMessage = false;
        ctrl.accountErrorMessage = false;
        ctrl.isCommercialTXMessage = false;
        ctrl.isCommercialGAMessage = false;
        ctrl.isOtherCommericalMessage = false;
        $scope.isLoading = true;
        $http.post('/api/account/setupAnonymousRenewal', {
            'AccountNumber': ctrl.accountNumber,
            'Last4': ctrl.last4SSN})
            .success(function (data) {
                $scope.isLoading = false;
                if (data.success) {
                    if (data.availableForRenewal) {
                        if (data.isCommercial) {
                            ctrl.accountNumber = '';
                            ctrl.last4SSN = '';
                            $scope.validations = [];
                            if (data.state == "TX") {
                                ctrl.isCommercialTXMessage = true;
                            }
                            else if (data.state == "GA") {
                                ctrl.isCommercialGAMessage = true;
                            }
                            else {
                                ctrl.isOtherCommericalMessage = true;
                            }
                        }
                        else {
                            $scope.isLoading = true;
                            if (queryUtilityPlanId) {
                                window.location.assign('/enrollment?renewal=true&renewalType=anon&UtilityPlanId=' + queryUtilityPlanId);
                            }
                            else {
                                window.location.assign('/enrollment?renewal=true&renewalType=anon');
                            }
                        }
                    }
                    else {
                        ctrl.renewErrorMessage = true;
                    }
                }
                else {
                    ctrl.accountErrorMessage = true;
                }
            })
            .error(function (error) {
                $scope.isLoading = false;
                $scope.streamConnectError = true;
            });
    }

    var queryAcctNumber = getParameterByName("AcctNumber");
    var queryLast4SSN = getParameterByName("Last4SSN");
    var queryUtilityPlanId = getParameterByName("UtilityPlanId");
    if (queryAcctNumber && queryLast4SSN) {
        ctrl.accountNumber = queryAcctNumber;
        ctrl.last4SSN = queryLast4SSN;
        ctrl.lookupAccount();
    }
    else {
        $scope.isLoading = false;
    }
}]);
