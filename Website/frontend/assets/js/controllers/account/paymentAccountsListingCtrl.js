/* My Payments Controller
 *
 */
ngApp.controller('AcctPaymentAccountsListingCtrl', ['$scope', '$http', function ($scope, $http) {
    // create  blank objects to hold the information
    $scope.paymentAccounts = [];
    $scope.isLoading = true;

    $http.get('/api/account/getSavedPaymentMethods').success(function (data, status, headers, config) {
        $scope.paymentAccounts = data;
        $scope.isLoading = false;
    });

    $scope.deletePaymentAccount = function (paymentAccountId) {
        $scope.isLoading = true;
        var formData = { paymentAccountId: paymentAccountId };

        $http.post('/api/account/deletePaymentAccount', formData).success(function (response) {
            $scope.isLoading = false;
            if (response.validations.length) {
                $scope.validations = response.validations;
            } else {
                // refresh the table
                $http.get('/api/account/getSavedPaymentMethods').success(function (data, status, headers, config) {
                    $scope.paymentAccounts = data;
                });
            }
        });
    }
}]);