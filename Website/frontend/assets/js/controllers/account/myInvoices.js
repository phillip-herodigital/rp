/* My Invoices Controller
 *
 */
ngApp.controller('AcctMyInvoicesCtrl', ['$scope', '$rootScope', '$http', '$filter', '$window', 'jQuery', function ($scope, $rootScope, $http, $filter, $window, jQuery) {
    // create a blank object to hold the information
    $scope.invoicesTable = {};
    $scope.invoicesTable.columnList = [];
    $scope.invoicesTable.values = [];
    $scope.isLoading = true;
    $scope.streamConnectError = false;
    $scope.filters = {};
    $scope.filtersList = {};
    $scope.filtersList.serviceType = [];
    $scope.filtersList.accountNumber = [];

    $http.get('/api/account/getInvoices').success(function (data, status, headers, config) {
        $scope.invoicesTable = data.invoices;
        $scope.invoicesTableOriginal = angular.copy($scope.invoicesTable);

        // make the columns responsive
        _.find($scope.invoicesTable.columnList, { 'field': 'accountNumber' }).hide = ['phone'];
        _.find($scope.invoicesTable.columnList, { 'field': 'invoiceNumber' }).hide = ['phone', 'tablet'];
        _.find($scope.invoicesTable.columnList, { 'field': 'dueDate' }).hide = ['phone', 'tablet'];

        // filters
        $scope.serviceTypes = _.pluck(_.uniq($scope.invoicesTable.values, 'serviceType'),'serviceType');
        $scope.accountNumbers = _.pluck(_.uniq($scope.invoicesTable.values, 'accountNumber'),'accountNumber');
        _.forEach($scope.serviceTypes,function(type) { $scope.filtersList.serviceType.push({ 'name' : type, 'value' : type }) }); 
        _.forEach($scope.accountNumbers,function(num) { $scope.filtersList.accountNumber.push({ 'name' : num, 'value' : num }) }); 
        $scope.filtersList.isPaid = [{ "name": "Paid", "value": true }, { "name": "Unpaid", "value": false }];

        // initial sort
        _.find($scope.invoicesTable.columnList, { 'field': 'dueDate' }).sortOrder = true;
        _.find($scope.invoicesTable.columnList, { 'field': 'dueDate' }).initialSort = true;

        $scope.isLoading = false;
        $scope.streamConnectError = false; 
    }).error(function() {
        $scope.isLoading = false;
        $scope.streamConnectError = true; 
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