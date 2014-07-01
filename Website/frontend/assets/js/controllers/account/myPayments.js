/* My Payments Controller
 *
 */
ngApp.controller('AcctMyPaymentsCtrl', ['$scope', '$rootScope', '$http', '$filter', '$timeout', '$sce', 'jQuery', function ($scope, $rootScope, $http, $filter, $timeout, $sce, jQuery) {
	// create  blank objects to hold the information
	$scope.paymentsTable = {};
	$scope.paymentsTable.columnList = [];
	$scope.paymentsTable.values = [];
	$scope.isLoading = true;
	$scope.showExpand = true;
	$scope.filters = {};
	$scope.filtersList = {};
	$scope.filtersList.serviceType = [];
	$scope.filtersList.accountNumber = [];
	$scope.filtersList.status = [];

	$timeout(function() {
		$http.get('/api/account/getPayments').success(function (data, status, headers, config) {
			$scope.paymentsTable = data.payments;
			$scope.paymentsTableOriginal = angular.copy($scope.paymentsTable);

			// filters
			$scope.serviceTypes = _.pluck(_.uniq($scope.paymentsTable.values, 'serviceType'),'serviceType');
			$scope.accountNumbers = _.pluck(_.uniq($scope.paymentsTable.values, 'accountNumber'),'accountNumber');
			$scope.statuses = _.pluck(_.uniq($scope.paymentsTable.values, 'status'),'status');
			_.forEach($scope.serviceTypes,function(type) { $scope.filtersList.serviceType.push({ 'name' : type, 'value' : type }) }); 
			_.forEach($scope.accountNumbers,function(num) { $scope.filtersList.accountNumber.push({ 'name' : num, 'value' : num }) }); 
			_.forEach($scope.statuses,function(status) { $scope.filtersList.status.push({ 'name' : status, 'value' : status }) }); 
			
			$scope.isLoading = false;
		});
	}, 800);

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
		if ($scope.paymentsTableOriginal) {
			$scope.paymentsTable.values = $filter('filter')($scope.paymentsTableOriginal.values, $scope.filters);
		}
	}, true);

}]);