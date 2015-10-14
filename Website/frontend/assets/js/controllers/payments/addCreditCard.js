ngApp.controller('AddCreditCardCtrl', ['$scope', '$http', '$window', 'logger', function ($scope, $http, $window, logger) {
    //Currently set autoPay status to false, will eventually set according to the account
    $scope.formData = {
        nickname: '',
        paymentAccount: {}
    };

    $scope.validations = [];
    $scope.isLoading = false;
    $scope.addPaymentAccount = function () {
        $scope.isLoading = true;
        $scope.formData.card().then(function (paymentInfo) {
            var formData = {
                nickname: $scope.formData.nickname,
                paymentAccount: paymentInfo
            };

            $http.post('/api/account/addPaymentAccount', formData).success(function (response) {
                if (response.validations.length) {
                    $scope.isLoading = false;
                    $scope.validations = response.validations;
                } else {
                    $window.location.href = response.redirectUri;
                }
            });
        }, function(error){
            $scope.isLoading = false;
            $scope.streamConnectError = true; 
        });
    };
}]);