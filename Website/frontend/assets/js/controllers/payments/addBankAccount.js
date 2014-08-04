ngApp.controller('AddBankAccountCtrl', ['$scope', '$http', function ($scope, $http) {
    //Currently set autoPay status to false, will eventually set according to the account
    $scope.formData = {
        nickname: '',
        bankAccount: {},
        description: ''
    };

    $scope.validations = [];

    $scope.addPaymentAccount = function () {
        var formData = {
            nickname: $scope.formData.nickname,
            bankAccount: $scope.formData.bankAccount(),
            description: $scope.formData.description
        };

        $http.post('/api/account/AddBankAccount', formData).success(function (response) {
            if (response.validations.length) {
                $scope.validations = response.validations;
            } else {
                // TODO
                console.log(response);
            }
        });
    };
}]);