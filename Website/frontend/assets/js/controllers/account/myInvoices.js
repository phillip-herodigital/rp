/* My Invoices Controller
 *
 */
ngApp.controller('AcctMyInvoicesCtrl', ['$scope', '$rootScope', '$http', '$filter', 'jQuery', function ($scope, $rootScope, $http, $filter, jQuery) {
	// create a blank object to hold the information
	$scope.invoicesTable = {};
	$scope.invoicesTable.columnList = [];
	$scope.invoicesTable.values = [];
	$scope.isLoading = true;
	$scope.filters = {};
	$scope.filtersList = {};
	$scope.filtersList.serviceType = [];
	$scope.filtersList.accountNumber = [];

	$http.get('/api/account/getInvoices').success(function (data, status, headers, config) {
		$scope.invoicesTable = data.invoices;
		$scope.invoicesTableOriginal = angular.copy($scope.invoicesTable);

		// filters
		$scope.serviceTypes = _.pluck(_.uniq($scope.invoicesTable.values, 'serviceType'),'serviceType');
		$scope.accountNumbers = _.pluck(_.uniq($scope.invoicesTable.values, 'accountNumber'),'accountNumber');
		_.forEach($scope.serviceTypes,function(type) { $scope.filtersList.serviceType.push({ 'name' : type, 'value' : type }) }); 
		_.forEach($scope.accountNumbers,function(num) { $scope.filtersList.accountNumber.push({ 'name' : num, 'value' : num }) }); 
		$scope.filtersList.isPaid = [{ "name": "Paid", "value": true }, { "name": "Unpaid", "value": false }];

		$scope.isLoading = false;

	});

	// methods
	$scope.resetFilters = function() {
		$scope.filters = {};
	};

	$scope.isFiltered = function() {
		return !jQuery.isEmptyObject($scope.filters);
	}

	// watches
	$scope.$watch('filters', function(newVal, oldVal) {
		$scope.filters = $filter('removeNullProps')($scope.filters);
		if ($scope.invoicesTableOriginal) {
			$scope.invoicesTable.values = $filter('filter')($scope.invoicesTableOriginal.values, $scope.filters);
		}
	}, true);

}]);