/* Account Selector Controller
 *
 */
ngApp.controller('AcctAccountSelectorCtrl', ['$scope', '$rootScope', '$http', '$timeout', function ($scope, $rootScope, $http, $timeout) {
	$scope.subAccount = {};

	// get the current data
	$timeout(function() {
		$http.get('/api/account/getAccounts').success(function (data, status, headers, config) {
			$scope.accounts = data;
			// initialize the current account
			$scope.currentAccount = $scope.accounts[0];
			$scope.currentSubAccount = $scope.currentAccount.subAccounts[0];
		});
	});

}]);