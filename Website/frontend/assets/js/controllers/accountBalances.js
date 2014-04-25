ngApp.controller('AccountBalances', ['$scope', '$rootScope', '$http', '$filter', function ($scope, $rootScope, $http, $filter) {

	$scope.accounts = [
		{
			'accountNumber': 1234567890,
			'amountDue': '87.24',
			'dueDate': '03/10/2014'
		},
		{
			'accountNumber': 2345678901,
			'amountDue': '129.50',
			'dueDate': '02/10/2014'
		}
	];

	var latestAccount = $filter('orderBy')($scope.accounts, "dueDate"),
		totalDue = _.reduce($scope.accounts, function(memo, item){
			return memo + parseFloat(item.amountDue, 10);
		}, 0);

	$scope.selectedAccount = {};
	$scope.paymentForm = {
		'accountNumber': null,
		'amount': totalDue,
		'dueDate': latestAccount[0].dueDate
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
			var selectedAccount = $scope.selectedAccount.account;
			$scope.paymentForm.accountNumber = (selectedAccount != null) ? selectedAccount.accountNumber : null;
			$scope.paymentForm.amount = (selectedAccount != null) ? selectedAccount.amountDue : totalDue;
			$scope.paymentForm.dueDate = (selectedAccount != null) ? selectedAccount.dueDate : latestAccount[0].dueDate;
		}
	}, true);

	$scope.submit = function() {
		console.log($scope.paymentForm);
	}

}]);