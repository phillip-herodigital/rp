ngApp.controller('ImpersonateUserCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {

        $scope.getAccount = function() {
            $scope.isLoading = true;
            $scope.errorMessage = false;
            var expiry = null;
            var token = null;

            $http.get("/api/authentication/impersonateParams?accountNumber=" + $scope.accountNumber).success(function(data) {
                    $scope.accountNumber = data.accountNumber;
                    expiry = data.expiry;
                    token = data.token;
                    $http.get("/api/authentication/impersonateUserList?accountNumber=" + $scope.accountNumber + "&expiry=" + expiry + "&token=" + token).success(function(usernames) {
                        $scope.isLoading = false;
                        $scope.errorMessage = false;
                        $scope.usernames = usernames;
                    }).error(function() {
                        $scope.isLoading = false;
                        $scope.errorMessage = true;
                    });
                })
                .error(function() {
                    $scope.isLoading = false;
                    $scope.errorMessage = true;
                });

            $scope.select = function(username) {
                $window.open("/api/authentication/impersonate?accountNumber=" + $scope.accountNumber + "&expiry=" + expiry + "&token=" + token + "&username=" + username);
            }

        }
    }
]);