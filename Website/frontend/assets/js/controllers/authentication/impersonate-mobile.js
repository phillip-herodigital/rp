ngApp.controller('ImpersonateMobileCtrl', [
    '$scope', '$http', '$window', function($scope, $http, $window) {
        var ctrl = this;
        this.activeStep = 1;

        this.back = function() {
            if (this.activeStep > 0) {
                this.activeStep--;
            }
        };

        $scope.isLoading = false;
        $scope.errorMessage = false;

        //Step 1
        this.findAccount = function() {
            $scope.isLoading = true;
            $scope.errorMessage = false;
            $http.get("/api/authentication/lookUpAccount?accountNumber=" + ctrl.accountNumber).success(function(data) {
                    $scope.isLoading = false;
                    if (!data.isAdmin) {
                        ctrl.adminError = true;
                        ctrl.acactiveStep = 1;
                    }
                    else if (data.isError) {
                        ctrl.adminError = false;
                        ctrl.errorMessage = true;
                        ctrl.activeStep = 1;
                    } else {
                        ctrl.adminError = false;
                        ctrl.errorMessage = false;
                        $scope.formData = data;
                        ctrl.activeStep = 2;
                    }
                })
                .error(function() {
                    $scope.isLoading = false;
                    $scope.errorMessage = true;
                });
          }

        //Step 2
        this.imperonsate = function () {
            $window.location.href = $scope.formData.impersonateUrl;

        };
    }
]);