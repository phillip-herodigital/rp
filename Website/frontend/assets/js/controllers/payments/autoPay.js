ngApp.controller('AutoPayCtrl', ['$scope', '$rootScope', '$http', '$modal', '$timeout',function ($scope, $rootScope, $http, $modal, $timeout) {
    $scope.successMessage = false;
    $scope.errorMessage = false;
    $scope.minDate = new Date();
    $scope.paymentAccounts = null;
    $scope.modalInstance = {};
    $scope.newAccount = '';
    $scope.isLoading = true;
    $scope.formData = {
        nickname: '',
        paymentAccount: {}
    };

    $http.get('/api/account/getSavedPaymentMethods').success(function (data, status, headers, config) { 
        $scope.paymentAccounts = data;
    });

    // when the account selector changes, reload the data
    $scope.$watch('selectedAccount.accountNumber', function(newVal) { 
        if (newVal) {
            $scope.isLoading = true;
            $http({
                method  : 'POST',
                url     : '/api/account/getAutoPayStatus',
                data    : { 'accountNumber' : newVal },
                headers : { 'Content-Type': 'application/JSON' } 
            }).success(function (data, status, headers, config) {
                $scope.account = data;
                $scope.successMessage = false;
                $scope.errorMessage = false;
                $scope.isLoading = false;
            });
        }
    });

    $scope.addAccount = function () {
        if ($scope.account.autoPay.paymentMethodId == 'addAccount') {

            // open the add account modal
            $scope.modalInstance = $modal.open({
                scope: $scope,
                templateUrl: 'AddPaymentAccount'
            });

            // run these finishing steps when the modal closes
            $scope.modalInstance.result.then(function () {
                // refresh the account data
                $http.get('/api/account/getSavedPaymentMethods').success(function (data) { 
                    $scope.paymentAccounts = data;
                    // select the newly added account
                    $timeout(function() {
                        $scope.account.autoPay.paymentMethodId = _.find($scope.paymentAccounts, { 'displayName': $scope.newAccount }).id;
                    }, 50);
                    $scope.isLoading = false;
                });
            }); 

            // reset the dropdown if the modal is dismissed
            if ($scope.newAccount == '') {
                $scope.account.autoPay.paymentMethodId = '';
            };
        }
    };

    $scope.getPaymentMethod = function (paymentId) {
        if (paymentId && paymentId !== 'addAccount') {
            return _.find($scope.paymentAccounts, { 'id': paymentId }).displayName;
        }
    };

    $scope.getPaymentMethodType = function (paymentId) {
        if (paymentId && paymentId !== 'addAccount') {
            return _.find($scope.paymentAccounts, { 'id': paymentId }).underlyingPaymentType;
        }
    };

    $scope.modalAddPaymentAccount = function (newPaymentMethodType) {
        $scope.isLoading = true;
        if (newPaymentMethodType == 'TokenizedCard') {
            $scope.formData.card().then(function (paymentInfo) {
                var formData = {
                    nickname: $scope.formData.nickname,
                    paymentAccount: paymentInfo
                };

                $http.post('/api/account/addPaymentAccount', formData).success(function (response) {
                    if (response.validations.length) {
                        $scope.validations = response.validations;
                    } else {
                        // if successful, clear the fields
                        $scope.formData = { nickname: '', paymentAccount: {} };

                        // set the newly added account so it can be selected
                        $scope.newAccount = formData.nickname;
                        
                        // close the modal
                        $scope.modalInstance.close();
                    }
                });
            });
        }

        if (newPaymentMethodType == 'TokenizedBank') {
            $scope.formData.bank().then(function (paymentInfo) {
                var formData = {
                    nickname: $scope.formData.nickname,
                    paymentAccount: paymentInfo
                };

                $http.post('/api/account/addPaymentAccount', formData).success(function (response) {
                    if (response.validations.length) {
                        $scope.validations = response.validations;
                    } else {
                        // if successful, clear the fields
                        $scope.formData = { nickname: '', paymentAccount: {} };

                        // set the newly added account so it can be selected
                        $scope.newAccount = formData.nickname;
                        
                        // close the modal
                        $scope.modalInstance.close();
                    }
                });
            });
        }
    };

    $scope.setAutoPay = function () {
        $scope.isLoading = true;
        $scope.successMessage = false;
        $scope.errorMessage = false;
        $http.post('/api/account/setAutoPay', {
            accountNumber: $scope.account.accountNumber,
            autoPay: $scope.account.autoPay,
            securityCode: $scope.account.securityCode
        }).success(function (data) {
            $scope.isLoading = false;
            if (!data.isSuccess) {
                // show the error message
                $scope.errorMessage = true;
            } else {
                // show the success message
                $scope.successMessage = true;
            }
        });
    };

   // Disable weekend selection
    $scope.disableWeekends = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

}]);