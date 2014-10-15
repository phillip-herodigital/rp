/* Make a Payment Controller
 *
 */
ngApp.controller('MakePaymentCtrl', ['$scope', '$rootScope', '$http', '$modal', '$q', '$timeout', function ($scope, $rootScope, $http, $modal, $q, $timeout) {

    $scope.paymentMethods = null;
    $scope.selectedAccounts = [];
    $scope.total = 0;
    $scope.overriddenWarnings = [];
    $scope.isLoading = true;
    $scope.activeState = 'step1';
    $scope.modalInstance = {};
    $scope.newAccount = '';
    $scope.formData = {
        nickname: '',
        paymentAccount: {}
    };

    $http.get('/api/account/getAccountBalancesTable').success(function (data, status, headers, config) {
        $scope.accountsTable = data.accounts;
        $scope.accountsTableOriginal = angular.copy($scope.accountsTable);

        // initial sort
        _.find($scope.accountsTable.columnList, { 'field': 'dueDate' }).sortOrder = true;
        _.find($scope.accountsTable.columnList, { 'field': 'dueDate' }).initialSort = true;

        $scope.isLoading = false;
    });

    $http.get('/api/account/getSavedPaymentMethods').success(function (data, status, headers, config) { 
        $scope.paymentAccounts = data;
    });

    $scope.addAccount = function (item) {
        if (item.selectedPaymentMethod == 'addAccount') {

            // open the add account modal
            $scope.modalInstance = $modal.open({
                scope: $scope,
                templateUrl: 'AddPaymentAccount'
            });

            // run these finishing steps when the modal closes
            $scope.modalInstance.result.then(function () {
                // refresh the account data
                $http.get('/api/account/getSavedPaymentMethods').success(function (data) { 
                    $scope.paymentAccounts = data;
                    // select the newly added account
                    $timeout(function() {
                        item.selectedPaymentMethod = _.find($scope.paymentAccounts, { 'displayName': $scope.newAccount }).id;
                    }, 50);
                    $scope.isLoading = false;
                });
            }); 

            // reset the dropdown if the modal is dismissed
            if ($scope.newAccount == '') {
                item.selectedPaymentMethod = '';
            };
        }
    }

    $scope.getPaymentMethod = function (paymentId) {
        if (paymentId && paymentId !== 'addAccount') {
            return _.find($scope.paymentAccounts, { 'id': paymentId }).displayName;
        }
    }

    $scope.resolvePayments = function () {
        // any additional validation can go here
        $scope.activeState = 'step2';
    };

    $scope.modalAddPaymentAccount = function (newPaymentMethodType) {
        $scope.isLoading = true;
        if (newPaymentMethodType == 'TokenizedCard') {
            $scope.formData.card().then(function (paymentInfo) {
                var formData = {
                    nickname: $scope.formData.nickname,
                    paymentAccount: paymentInfo
                };

                $http.post('/api/account/addPaymentAccount', formData).success(function (response) {
                    if (response.validations.length) {
                        $scope.validations = response.validations;
                    } else {
                        // if successful, clear the fields
                        $scope.formData = { nickname: '', paymentAccount: {} };

                        // set the newly added account so it can be selected
                        $scope.newAccount = formData.nickname;
                        
                        // close the modal
                        $scope.modalInstance.close();
                    }
                });
            });
        }

        if (newPaymentMethodType == 'TokenizedBank') {
            $scope.formData.bankAccount().then(function (paymentInfo) {
                var formData = {
                    nickname: $scope.formData.nickname,
                    paymentAccount: paymentInfo
                };

                $http.post('/api/account/addPaymentAccount', formData).success(function (response) {
                    if (response.validations.length) {
                        $scope.validations = response.validations;
                    } else {
                        // if successful, clear the fields
                        $scope.formData = { nickname: '', paymentAccount: {} };

                        // refresh the account data
                        $http.get('/api/account/getSavedPaymentMethods').success(function (data) { 
                            $scope.paymentAccounts = data;
                        });

                        // close the modal
                        $close();
                    }
                });
            });
        }
    };

    $scope.makePayment = function () {
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