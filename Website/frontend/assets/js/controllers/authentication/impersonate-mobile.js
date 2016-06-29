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
        $scope.accessError = false;

        //Step 1
        this.findAccount = function() {
            $scope.isLoading = true;
            $scope.errorMessage = false;
            $http.get("/api/streamauthentication/lookUpAccount?accountNumber=" + ctrl.accountNumber).success(function(data) {
                    $scope.isLoading = false;
                    if (!data.hasAccess) {
                        ctrl.accessError = true;
                        ctrl.acactiveStep = 1;
                    } else if (data.isError) {
                        ctrl.accessError = false;
                        ctrl.errorMessage = true;
                        ctrl.activeStep = 1;
                    } else {
                        ctrl.accessError = false;
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
    }
]);