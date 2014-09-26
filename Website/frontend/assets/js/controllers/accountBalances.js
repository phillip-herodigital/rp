ngApp.controller('AccountBalances', ['$scope', '$rootScope', '$http', '$filter', function ($scope, $rootScope, $http, $filter) {

	// $scope.accounts = [
	// 	{
	// 		"accountNumber": 1234567890,
	// 		"amountDue": "87.24",
	// 		"dueDate": "03/10/2014"
	// 	},
	// 	{
	// 		"accountNumber": 2345678901,
	// 		"amountDue": "129.50",
	// 		"dueDate": "02/10/2014"
	// 	}
	// ];

	$scope.accounts = [];
	$scope.selectedAccount = {
		'account': null
	};
	$scope.paymentForm = {};
	$scope.isLoading = true;

	$http.get('assets/json/accountBalances.json').success(function(data, status, headers, config) {
		$scope.accounts = data;
		loadSelectedAccount($scope.selectedAccount.account);
		$scope.isLoading = false;
	});

	var loadSelectedAccount = function(account) {
		if (account == null) {
			// All accounts
			$scope.paymentForm.accountNumber = null;
			$scope.paymentForm.amount = getTotalDue();
			$scope.paymentForm.dueDate = getLatestDueDate();
		} else {
			$scope.paymentForm.accountNumber = account.accountNumber;
			$scope.paymentForm.amount = account.amountDue;
			$scope.paymentForm.dueDate = account.dueDate;
		}
	},
	getLatestDueDate = function() {
		var latestAccounts = $filter('orderBy')($scope.accounts, "dueDate");
		if (latestAccounts.length && latestAccounts[0].dueDate) {
			return latestAccounts[0].dueDate;
		}
		return '';
	},
	getTotalDue = function () {
	    var total = 0;
	    angular.forEach($scope.accounts, function (account, key) {
	        total += parseFloat(account.amountDue, 10);
	    });
	    return total;
	};

	$scope.paymentMethods = [
		{
			'id': 1,
			'name': 'My Visa'
		},
		{
			'id': 2,
			'name': 'Bank Account'
		}
	];

	$scope.$watch('selectedAccount.account', function(newVal, oldVal) {
		if (newVal !== oldVal) {
			loadSelectedAccount($scope.selectedAccount.account);
		}
	}, true);

	$scope.submit = function() {
		/*console.log($scope.paymentForm);*/
	}

}]);