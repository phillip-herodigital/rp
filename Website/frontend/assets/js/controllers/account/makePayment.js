/* Make a Payment Controller
 *
 */
ngApp.controller('MakePaymentCtrl', ['$scope', '$rootScope', '$http', '$modal', '$q', '$timeout', function ($scope, $rootScope, $http, $modal, $q, $timeout) {

    $scope.paymentAccounts = null;
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
    };

    $scope.$watch("paymentAccounts", function (newVal, oldVal) {
        if (newVal != oldVal){
            paymentAccountsForIndex = [];
        }
    });
    var paymentAccountsForIndex = [];
    $scope.paymentAccountsFor = function (acct) {
        if (acct == null) return [];
        if (paymentAccountsForIndex[acct.accountNumber]) return paymentAccountsForIndex[acct.accountNumber];

        paymentAccountsForIndex[acct.accountNumber] = _.map($scope.paymentAccounts, function (pa) {
            if (pa.underlyingType == "Unknown" || _.some(acct.availablePaymentMethods, { 'paymentMethodType': pa.underlyingType })) {
                return pa;
            } else {
                var newpa = angular.copy(pa);
                newpa.id = "";
                return newpa;
            }
        });
        return paymentAccountsForIndex[acct.accountNumber];
    };

    $scope.getPaymentMethod = function (paymentId) {
        if (paymentId && paymentId !== 'addAccount') {
            return _.find($scope.paymentAccounts, { 'id': paymentId }).displayName;
        }
    };

    $scope.getPaymentMethodType = function (paymentId) {
        if (paymentId && paymentId !== 'addAccount') {
            return _.find($scope.paymentAccounts, { 'id': paymentId }).underlyingPaymentType;
        }
    };

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
            $scope.formData.bank().then(function (paymentInfo) {
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
    };

    $scope.makePayment = function () {
        $scope.isLoading = true;
        var payments = _.map($scope.selectedAccounts, function(acct) { 
            return {
                'paymentAccount': _.find($scope.paymentAccounts, { 'id': acct.selectedPaymentMethod }),
                'accountNumber': acct.accountNumber,
                'paymentAmount': acct.paymentAmount,
                'securityCode' : acct.securityCode
            }
        });
        $http.post('/api/account/makeMultiplePayments', {
            accounts: payments,
            paymentDate: $scope.selectedDate,
            overrideWarnings: $scope.overriddenWarnings
        }).success(function (data) {
            $scope.isLoading = false;
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
                _.forEach(data.confirmations, function (account) {
                    var temp = _.find($scope.selectedAccounts, { accountNumber: account.accountNumber });
                    temp.confirmationNumber = account.paymentConfirmationNumber;
                    temp.convenienceFee = account.convenienceFee;
                    temp.paymentAccount = _.find($scope.paymentAccounts, { 'id': temp.selectedPaymentMethod });
                    $scope.paymentAmount += $scope.selectedAccounts.length != 1 ? temp.invoiceAmount : 0;
                });
            }
        });
    };

    $scope.$watch('accountsTable.values', function(newVal) {
        if (!$scope.accountsTable)
            return false;
        $scope.selectedAccounts = _.where($scope.accountsTable.values, { 'selected': true, 'canMakeOneTimePayment': true });
        $scope.total = _.reduce($scope.selectedAccounts, function (a, b) { return a + parseFloat(b.paymentAmount); }, 0);
        $scope.paymentAmount = _.reduce($scope.selectedAccounts, function (a, b) { return a + parseFloat(b.paymentAmount) + 2.95; }, 0);
    }, true);

    // Disable weekends selection
    $scope.disableWeekends = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.selectedDate = $scope.minDate = new Date();

}]);