ngApp.controller('AddCreditCardCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    //Currently set autoPay status to false, will eventually set according to the account
    $scope.formData = {
        nickname: '',
        card: {}
    };

    $scope.validations = [];

    $scope.addPaymentAccount = function () {
        $scope.formData.card().then(function (paymentInfo) {
            var formData = {
                nickname: $scope.formData.nickname,
                card: paymentInfo
            };

            $http.post('/api/account/AddCreditCard', formData).success(function (response) {
                if (response.validations.length) {
                    $scope.validations = response.validations;
                } else {
                    $window.location.href = response.redirectUri;
                }
            });
        });
    };
}]);