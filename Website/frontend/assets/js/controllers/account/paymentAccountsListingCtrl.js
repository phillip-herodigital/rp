/* My Payments Controller
 *
 */
ngApp.controller('AcctPaymentAccountsListingCtrl', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {
    // create  blank objects to hold the information
    $scope.paymentAccounts = [];
    $scope.isLoading = true;

    $http.get('/api/account/getSavedPaymentMethods?includeAutoPayFlag=true').success(function (data, status, headers, config) {
        $scope.paymentAccounts = data;
        $scope.isLoading = false;
    });

    $scope.deletePaymentAccount = function (paymentAccount) {
        $scope.paymentAccount = paymentAccount;
        var modalInstance = $modal.open({
            templateUrl: 'removePaymentAccount',
            scope: $scope
        });

        modalInstance.result.then(function () {
            $scope.isLoading = true;
            var formData = { paymentAccountId: paymentAccount.id };

            $http.post('/api/account/deletePaymentAccount', formData).success(function (response) {
                $scope.isLoading = false;
                if (response.validations.length) {
                    $scope.validations = response.validations;
                } else {
                    // refresh the table
                    $http.get('/api/account/getSavedPaymentMethods?includeAutoPayFlag=true').success(function (data, status, headers, config) {
                        $scope.paymentAccounts = data;
                    });
                }
            });
        });
    }

    $scope.autoPayWarning = function () {
        var modalInstance = $modal.open({
            templateUrl: 'autoPayWarning',
            scope: $scope
        });
    }
}]);