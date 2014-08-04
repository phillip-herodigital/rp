/* Account Balances and Payments Controller
 *
 */
ngApp.controller('AcctBalancesAndPaymentsCtrl', ['$scope', '$rootScope', '$http', '$modal', '$timeout', function ($scope, $rootScope, $http, $modal, $timeout) {
	
    $scope.accounts = null;
    $scope.paymentMethods = null;
    $scope.selectedAccount = null;
    $scope.total = 0;
    $scope.overriddenWarnings = [];

    // get the current data
	$timeout(function() {
		$http.get('/api/account/getAccountBalances').success(function (data, status, headers, config) {
			$scope.accounts = data.accounts; 
			$scope.selectedAccount = $scope.accounts[0];
			$scope.paymentAmount = $scope.selectedAccount.accountBalance;
		});
		$http.get('/api/account/getSavedPaymentMethods').success(function (data, status, headers, config) { 
			$scope.paymentMethods = data; 
		});
	}, 800);

    $scope.paymentMethod = function () {
        if ($scope.useNewPaymentMethod) {
            return $scope.newPaymentMethod[$scope.newPaymentMethodType]();
        } else {
            return $scope.selectedPaymentMethod;
        }
    };

    $scope.resetAccount = function () {
    	$scope.activeState = 'step1';
    	$scope.paymentAmount = $scope.selectedAccount.accountBalance;
    };

    $scope.makePayment = function () {
        $http.post('/api/account/makeMultiplePayments', {
            paymentAccount: $scope.paymentMethod(),
            accountNumbers: [$scope.selectedAccount.accountNumber],
            totalPaymentAmount: $scope.paymentAmount,
            paymentDate: new Date(),
            overrideWarnings: $scope.overriddenWarnings
        }).success(function (data) {
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

    $scope.activeState = 'step1';

}]);