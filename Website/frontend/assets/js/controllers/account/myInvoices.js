/* My Invoices Controller
 *
 */
ngApp.controller('AcctMyInvoicesCtrl', ['$scope', '$rootScope', '$http', '$filter', '$timeout', 'jQuery', function ($scope, $rootScope, $http, $filter, $timeout, jQuery) {
	// create a blank object to hold the information
	$scope.invoicesTable = {};
	$scope.invoicesTable.columnList = [];
	$scope.invoicesTable.values = [];
	$scope.isLoading = true;

	$timeout(function() {
		$http.get('/api/account/getInvoices').success(function (data, status, headers, config) {
			$scope.invoicesTable = data.invoices;
			$scope.invoicesTableOriginal = angular.copy($scope.invoicesTable);
			$scope.isLoading = false;
		});
	}, 2000);

	// filters
	$scope.filters = {};
	$scope.filtersList = {
		"serviceType": [
			{
				"name": "HomeLife Services",
				"value": "HomeLife Services"
			},
			{
				"name": "Utility",
				"value": "Utility"
			}
		],
		"accountNumber": [
			{
				"name": "1197015532",
				"value": "1197015532"
			},
			{
				"name": "219849302",
				"value": "219849302"
			},
			{
				"name": "194829927",
				"value": "194829927"
			}
		],
		"isPaid": [
			{
				"name": "Paid",
				"value": true
			},
			{
				"name": "Unpaid",
				"value": false
			}
		]
	};

	// methods
	$scope.resetFilters = function() {
		$scope.filters = {};
	};

	$scope.isFiltered = function() {
		return !jQuery.isEmptyObject($scope.filters);
	}

	$scope.test = function() {
		console.log($scope);
	};

	// watches
	$scope.$watch('filters', function(newVal, oldVal) {
		
		$scope.filters = $filter('removeNullProps')($scope.filters);
		if ($scope.invoicesTable.values.length) {
			$scope.invoicesTable.values = $filter('filter')($scope.invoicesTableOriginal.values, $scope.filters);
		}

	}, true);

}]);