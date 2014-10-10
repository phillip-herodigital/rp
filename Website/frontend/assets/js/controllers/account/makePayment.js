/* Make a Payment Controller
 *
 */
ngApp.controller('MakePaymentCtrl', ['$scope', '$rootScope', '$http', '$modal', '$q', function ($scope, $rootScope, $http, $modal, $q) {

    $scope.paymentMethods = null;
    $scope.selectedAccounts = [];
    $scope.total = 0;
    $scope.overriddenWarnings = [];
    $scope.isLoading = true;
    $scope.activeState = 'step1';

    $http.get('/api/account/getAccountBalancesTable').success(function (data, status, headers, config) {
        $scope.accountsTable = data.accounts;
        $scope.accountsTableOriginal = angular.copy($scope.accountsTable);
        $scope.isLoading = false;
    });
    $http.get('/api/account/getSavedPaymentMethods').success(function (data, status, headers, config) { 
        $scope.paymentMethods = data; 
    });
    this.paymentMethod = function () {
        if ($scope.useNewPaymentMethod) {
            return $scope.newPaymentMethod[$scope.newPaymentMethodType]();
        } else {
            var deferred = $q.defer();
            deferred.resolve($scope.selectedPaymentMethod);
            return deferred.promise;
        }
    }

    this.resolvePaymentMethod = function () {
        $scope.paymentMethod().then(function (data) {
            $scope.evaluatedPaymentMethod = data;
            $scope.activeState = 'step2';
        });
    };

    this.makePayment = function () {

        $http.post('/api/account/makeMultiplePayments', {
            paymentAccount: $scope.evaluatedPaymentMethod,
            accountNumbers: _.pluck($scope.selectedAccounts, 'accountNumber'),
            totalPaymentAmount: $scope.paymentAmount,
            paymentDate: $scope.selectedDate,
            overrideWarnings: $scope.overriddenWarnings
        }).success(function (data) {
            if (data.blockingAlertType) {

                $modal.open({
                    templateUrl: 'PaymentBlockingAlert/' + data.blockingAlertType,
                    scope: $scope
                }).result.then(function () {
                    $scope.overriddenWarnings.push(data.blockingAlertType);
                    $scope.makePayment();
                });

            } else {
                $scope.activeState = 'step3';
                if ($scope.selectedAccounts.length != 1) {
                    $scope.paymentAmount = 0.00;
                }
                _.forEach(data.confirmations, function (account) {
                    _.find($scope.selectedAccounts, { accountNumber: account.accountNumber }).confirmationNumber = account.paymentConfirmationNumber
                    $scope.paymentAmount += $scope.selectedAccounts.length != 1 ? _.find($scope.selectedAccounts, { accountNumber: account.accountNumber }).invoiceAmount : 0;
                });
            }
        });
    };

    $scope.$watch('accountsTable.values', function(newVal) {
        if (!$scope.accountsTable)
            return false;
        $scope.selectedAccounts = _.where($scope.accountsTable.values, { 'selected': true, 'canMakeOneTimePayment': true });
        $scope.total = _.reduce($scope.selectedAccounts, function (a, b) { return a + parseFloat(b.paymentAmount); }, 0);
        $scope.paymentAmount = $scope.total;
    }, true);

    // Disable weekends selection
    $scope.disableWeekends = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.selectedDate = $scope.minDate = new Date();

    

}]);