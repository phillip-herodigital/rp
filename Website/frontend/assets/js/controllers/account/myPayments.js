/* My Payments Controller
 *
 */
ngApp.controller('AcctMyPaymentsCtrl', ['$scope', '$rootScope', '$http', '$filter', 'jQuery', function ($scope, $rootScope, $http, $filter, jQuery) {
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
    $scope.hasConfirmation = true;
    $scope.hasPaymentStatus = true;

    $http.get('/api/account/getPayments').success(function (data, status, headers, config) {
        $scope.paymentsTable = data.payments;
        $scope.paymentsTableOriginal = angular.copy($scope.paymentsTable);

        // make the columns responsive
        _.find($scope.paymentsTable.columnList, { 'field': 'isRecurring' }).hide = ['phone', 'tablet'];
        _.find($scope.paymentsTable.columnList, { 'field': 'accountNumber' }).hide = ['phone'];
        _.find($scope.paymentsTable.columnList, { 'field': 'confirmCode' }).hide = ['phone', 'tablet'];
        _.find($scope.paymentsTable.columnList, { 'field': 'paymentDate' }).hide = ['phone', 'tablet'];
        _.find($scope.paymentsTable.columnList, { 'field': 'status' }).hide = ['phone', 'tablet'];
        _.find($scope.paymentsTable.columnList, { 'field': 'actions' }).hide = ['phone'];

        // filters
        $scope.serviceTypes = _.pluck(_.uniq($scope.paymentsTable.values, 'serviceType'),'serviceType');
        $scope.accountNumbers = _.pluck(_.uniq($scope.paymentsTable.values, 'accountNumber'),'accountNumber');
        $scope.statuses = _.pluck(_.uniq($scope.paymentsTable.values, 'status'),'status');
        _.forEach($scope.serviceTypes,function(type) { $scope.filtersList.serviceType.push({ 'name' : type, 'value' : type }) }); 
        _.forEach($scope.accountNumbers,function(num) { $scope.filtersList.accountNumber.push({ 'name' : num, 'value' : num }) }); 
        _.forEach($scope.statuses,function(status) { $scope.filtersList.status.push({ 'name' : status, 'value' : status }) }); 
        
        //  check to see if we need to hide columns for unsupported systems
        $scope.hasConfirmation = _.every($scope.paymentsTable.values, function(val) { return _.has(val, 'confirmCode') });
        $scope.hasPaymentStatus = _.every($scope.paymentsTable.values, function(val) { return _.has(val, 'status') });
        if (!$scope.hasConfirmation) {
            $scope.paymentsTable.columnList = _.reject($scope.paymentsTable.columnList, {'field': 'confirmCode'});
        }
        if (!$scope.hasPaymentStatus) {
            $scope.paymentsTable.columnList = _.reject($scope.paymentsTable.columnList, {'field': 'status'});       
        }

        // default sort
        //$scope.sortFieldName = 'paymentDate';
        //$scope.sortOrder = true;
        
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
        if ($scope.paymentsTableOriginal) {
            $scope.paymentsTable.values = $filter('filter')($scope.paymentsTableOriginal.values, $scope.filters);
        }
    }, true);

}]);