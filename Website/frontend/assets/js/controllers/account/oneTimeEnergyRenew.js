/*
    One time energy contract renewal
*/
ngApp.controller('OneTimeRenewalCtrl', ['$scope', '$http', '$timeout', '$location', function ($scope, $http, $timeout, $location) {
    var ctrl = this;
    this.activeStep = 1;
    ctrl.overrideWarnings = [];

    $scope.isLoading = false;
    $scope.streamConnectError = false;

    ctrl.lookupAccount = function () {
        $scope.isLoading = true;
        $http({
            method: 'POST',
            url: '/api/account/FindAccountForOneTimeRenewal',
            data: { 'AccountNumber': ctrl.accountNumber, 'Last4': ctrl.last4SSN },
            headers: { 'Content-Type': 'application/JSON' }
        })
        .success(function (data, status, headers, config) {
            $scope.isLoading = false;
            $scope.streamConnectError = false;
            if (data.success)
            {
                if (data.availableForRenewal) {
                    var accountData = {
                        'AccountId': data.accountID,
                        'SubAccountId': data.subaccountID
                    };
                    $scope.isLoading = true;
                    $http.post('/api/account/setupRenewal', accountData)
                            .success(function () {
                                $scope.isLoading = false;
                                window.location.href('/enrollment?renewal=true');
                            })
                            .error(function () {
                                $scope.isLoading = false;
                                $scope.streamConnectError = true;
                            });
                }
                else {
                    ctrl.renewErrorMessage = true;
                } 
            }
            else
            {
                ctrl.accountErrorMessage = true;
            }
        })
        .error(function () {
            $scope.isLoading = false;
            $scope.streamConnectError = true;
        })
    };
}]);
