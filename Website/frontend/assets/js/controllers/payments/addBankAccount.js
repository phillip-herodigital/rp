ngApp.controller('AddBankAccountCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    //Currently set autoPay status to false, will eventually set according to the account
    $scope.formData = {
        nickname: '',
        bankAccount: {},
        description: ''
    };

    $scope.validations = [];

    $scope.addPaymentAccount = function () {
        $scope.formData.bankAccount().then(function (paymentInfo) {
            var formData = {
                nickname: $scope.formData.nickname,
                bankAccount: paymentInfo,
                description: $scope.formData.description
            };

            $http.post('/api/account/AddBankAccount', formData).success(function (response) {
                if (response.validations.length) {
                    $scope.validations = response.validations;
                } else {
                    $window.location.href = response.redirectUri;
                }
            });
        });
    };
}]);