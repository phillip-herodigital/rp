/* Account Balances and Payments Controller
 *
 */
ngApp.controller('AcctBalancesAndPaymentsCtrl', ['$scope', '$rootScope', '$http', '$modal', '$timeout', function ($scope, $rootScope, $http, $modal, $timeout) {
	
    $scope.accounts = null;
    $scope.paymentAccounts = null;
    $scope.selectedAccount = null;
    $scope.total = 0;
    $scope.overriddenWarnings = [];
    $scope.confirmationNumber = '';
    $scope.isLoading = true;
    $scope.activeState = 'step1';
    $scope.modalInstance = {};
    $scope.newAccount = '';
    $scope.formData = {
        nickname: '',
        paymentAccount: {}
    };

    // get the current data
	$http.get('/api/account/getAccountBalances').success(function (data, status, headers, config) {
		$scope.accounts = data.accounts; 
		$scope.selectedAccount = $scope.accounts[0];
		$scope.paymentAmount = $scope.selectedAccount.amountDue;
        $scope.accountsCount = $scope.accounts.length;
        $scope.isLoading = false;
	});
	$http.get('/api/account/getSavedPaymentMethods').success(function (data, status, headers, config) { 
		$scope.paymentAccounts = data; 
	});

    $scope.resetAccount = function () {
    	$scope.activeState = 'step1';
    	$scope.paymentAmount = $scope.selectedAccount.amountDue;
    };

    $scope.addAccount = function () {
        if ($scope.selectedPaymentMethod == 'addAccount') {

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
                        $scope.selectedPaymentMethod = _.find($scope.paymentAccounts, { 'displayName': $scope.newAccount }).id;
                    }, 50);
                    $scope.isLoading = false;
                });
            }); 

            // reset the dropdown if the modal is dismissed
            if ($scope.newAccount == '') {
                $scope.selectedPaymentMethod = '';
            };
        }
    };

    $scope.getPaymentMethod = function (paymentId) {
        if (paymentId && paymentId !== 'addAccount') {
            return _.find($scope.paymentAccounts, { 'id': paymentId }).displayName;
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
            $scope.formData.bankAccount().then(function (paymentInfo) {
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

                        // refresh the account data
                        $http.get('/api/account/getSavedPaymentMethods').success(function (data) { 
                            $scope.paymentAccounts = data;
                        });

                        // close the modal
                        $close();
                    }
                });
            });
        }
    };

    $scope.makePayment = function () {
        $scope.isLoading = true;
        var payments = [{
            'paymentAccount': _.find($scope.paymentAccounts, { 'id': $scope.selectedPaymentMethod }),
            'accountNumber': $scope.selectedAccount.accountNumber,
            'paymentAmount': $scope.paymentAmount
        }];
        $http.post('/api/account/makeMultiplePayments', {
            accounts: payments,
            paymentDate: new Date(),
            overrideWarnings: $scope.overriddenWarnings
        }).success(function (data) {
            $scope.isLoading = false;
            if (data.blockingAlertType) {

                $modal.open({
                    templateUrl: 'PaymentBlockingAlert/' + data.blockingAlertType,
                    scope: $scope
                }).result.then(function () {
                    $scope.overriddenWarnings.push(data.blockingAlertType);
                    $scope.makePayment();
                });

            } else {
                $scope.activeState = 'step3';
                _.forEach(data.confirmations, function (account) {
                    $scope.confirmationNumber = account.paymentConfirmationNumber
                });
            }
        });
    };

}]);