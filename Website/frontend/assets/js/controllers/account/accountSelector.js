/* Account Selector Controller
 *
 */
ngApp.controller('AcctAccountSelectorCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
	// get the current data

    $http.get('/api/account/getAccounts').success(function (data, status, headers, config) {
        $scope.accounts = _.filter(data, function (acct) {
            return !$scope.filterAccountType || acct.accountType.toLowerCase() == $scope.filterAccountType.toLowerCase();
        });
        
		// initialize the current account
		$scope.accountsCount = $scope.accounts.length;

		if ($scope.accounts.length == 0) {
		    $scope.updateSelectedAccount(false, false, false);
		} else {
            $scope.currentAccount = $scope.accounts[0];
		    //$scope.currentSubAccount = $scope.currentAccount.subAccounts[0];
		    $scope.updateSelectedAccount($scope.currentAccount.accountNumber, $scope.currentAccount.subAccountLabel, $scope.currentSubAccount);
		}
		

	});

	$scope.updateSelectedAccount = function(accountNumber, subAccountLabel, subaccount) {
		$scope.selectedAccount.accountNumber = accountNumber;
		$scope.selectedAccount.subAccountLabel = subAccountLabel;
		$scope.selectedAccount.subaccount = subaccount;
	};

}]);