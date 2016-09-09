/* Paperless Billing Controller
 *
 */
ngApp.controller('PaperlessBillingCtrl', ['$scope', '$http', function ($scope, $http) {
    // create a blank object to hold the form information
    $scope.formData = { };

    // when the account selector changes, reload the data
    $scope.$watch('selectedAccount.accountNumber', function (newVal) {
        if (newVal) {
            $scope.isLoading = true;
            $http({
                method: 'POST',
                url: '/api/account/getAccountInformation',
                data: { 'accountNumber': newVal },
                headers: { 'Content-Type': 'application/JSON' }
            })
                .success(function (data, status, headers, config) {
                    $scope.formData = data;
                    $scope.successMessage = false;
                    $scope.isLoading = false;
                    $scope.paperlessBillingError = false;
                })
                .error(function () {
                    $scope.isLoading = false;
                    $scope.paperlessBillingError = true;
                });
        }
    });

    // process the form
    $scope.updateAccountInformation = function () {
        // format the request data
        $scope.successMessage = $scope.errorMessage = false;
        $scope.isLoading = true;

        // sent the update
        $http({
            method: 'POST',
            url: '/api/account/updateAccountInformation',
            data: {
                accountNumber: $scope.selectedAccount.accountNumber,
                phone: $scope.formData.phone,
                email: $scope.formData.email,
                billingAddress: $scope.formData.billingAddress,
                disablePrintedInvoices: $scope.formData.disablePrintedInvoices

            },
            headers: { 'Content-Type': 'application/JSON' }
        })
            .success(function (data, status, headers, config) {
                $scope.isLoading = false;
                if (data.validations.length) {
                    // if not successful, bind errors to error variables
                    //$scope.validations = data.validations;

                } else if (!data.success) {
                    $scope.errorMessage = true;
                } else {
                    // if successful, show the success message
                    $scope.successMessage = true;
                }
            })
            .error(function (data, status, headers, config) {
                $scope.isLoading = false;
                $scope.errorMessage = true;
            });
    };

}]);