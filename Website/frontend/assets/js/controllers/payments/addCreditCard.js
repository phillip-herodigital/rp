ngApp.controller('AddCreditCardCtrl', ['$scope', '$http', function ($scope, $http) {
    //Currently set autoPay status to false, will eventually set according to the account
    $scope.formData = {
        nickname: '',
        card: {}
    };

    $scope.validations = [];

    $scope.addPaymentAccount = function () {
        var formData = {
            nickname: $scope.formData.nickname,
            card: $scope.formData.card()
        };

        $http.post('/api/account/AddCreditCard', formData).success(function (response) {
            if (response.validations.length) {
                $scope.validations = response.validations;
            } else {
                // TODO
                console.log(response);
            }
        });
    };
}]);