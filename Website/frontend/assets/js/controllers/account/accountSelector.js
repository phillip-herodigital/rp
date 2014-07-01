/* Account Selector Controller
 *
 */
ngApp.controller('AcctAccountSelectorCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
	// get the current data

	$http.get('/api/account/getAccounts').success(function (data, status, headers, config) {
		$scope.accounts = data;
		// initialize the current account
		$scope.currentAccount = $scope.accounts[0];
		$scope.currentSubAccount = $scope.currentAccount.subAccounts[0];
		$scope.updateSelectedAccount($scope.currentAccount.accountNumber, $scope.currentAccount.subAccountLabel, $scope.currentSubAccount);

	});

	$scope.updateSelectedAccount = function(accountNumber, subAccountLabel, subaccount) {
		$scope.selectedAccount.accountNumber = accountNumber;
		$scope.selectedAccount.subAccountLabel = subAccountLabel;
		$scope.selectedAccount.subaccount = subaccount;
	};

}]);