/* My Payments Controller
 *
 */
ngApp.controller('AcctMyPaymentsCtrl', ['$scope', '$rootScope', '$http', '$filter', '$timeout', '$sce', 'jQuery', function ($scope, $rootScope, $http, $filter, $timeout, $sce, jQuery) {
	// create a blank object to hold the information
	$scope.paymentsTable = {};
	$scope.paymentsTable.columnList = [];
	$scope.paymentsTable.values = [];
	$scope.isLoading = true;
	$scope.showExpand = true;

	$timeout(function() {
		$http.get('/api/account/getPayments').success(function (data, status, headers, config) {
			$scope.paymentsTable = data.payments;
			$scope.paymentsTableOriginal = angular.copy($scope.paymentsTable);
			$scope.isLoading = false;
		});
	}, 800);

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
		if ($scope.paymentsTable.values.length) {
			$scope.paymentsTable.values = $filter('filter')($scope.paymentsTableOriginal.values, $scope.filters);
		}

	}, true);

}]);