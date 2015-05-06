/* Mobile SIM Activation Controller
 *
 */
ngApp.controller('MobileSimActivationCtrl', ['$scope', '$http', '$location', '$modal', function ($scope, $http, $location, $modal) {
    $scope.selectedPhone = null;
    $scope.isLoading = false;
    $scope.activeState = $scope.simActivationSettings.activationAvailable ? 'step1' : 'activationUnavailable';
    $scope.lookupAccountError = false;
    $scope.activateServiceError = false;
    $scope.activateData = false;

    $scope.$watch("selectedPhone", function(newVal) { 
        if (newVal == 'gsm') {
            $scope.activeState = 'step2';
        } 
        if (newVal == 'cdma') {
            $scope.activeState = 'step2CDMA';
        }
    }); 

    $scope.cancelActivation = function () {
        $scope.selectedPhone = null;
        $scope.activeState = 'step1';
    };

    $scope.lookupAccount = function () {
        $scope.isLoading = true;
        $scope.lookupAccountError = false;

        $http({
            method: 'POST',
            url: '/api/mobileActivation/lookupAccountByEsn',
            data: {  
                activationCode: $scope.activation.code, 
                lastName: $scope.activation.lastName
            },
            headers: {
                'Content-Type': 'application/JSON'
            } 
        })  
        .success(function (data, status, headers, config) {
            $scope.isLoading = false;
            if (data.accountNumber) {
                $scope.account = data;
                $scope.activeState = 'step3';
            } else {
                $scope.lookupAccountError = true;
            }
        }).error(function(data, status, headers, config) {
            $scope.isLoading = false;
            $scope.lookupAccountError = true;
        });
    };

    $scope.activateService = function () {
        $scope.isLoading = true;
        $scope.activateServiceError = false;

        $http({
            method: 'POST',
            url: '/api/mobileActivation/activateEsn',
            data: {  
                activationCode: $scope.activation.code, 
                accountNumber: $scope.account.accountNumber
            },
            headers: {
                'Content-Type': 'application/JSON'
            } 
        })  
        .success(function (data, status, headers, config) {
            $scope.isLoading = false;
            if (data && data != 'false') {
                $scope.activeState = 'step4';
            } else {
                $scope.activateServiceError = true;
            }
        }).error(function(data, status, headers, config) {
            $scope.isLoading = false;
            $scope.activateServiceError = true;
        });
    };

    $scope.showUnlockingModal = function () {
        $modal.open({
            'scope': $scope,
            'templateUrl': 'networkUnlocking/att'
        })
    };

}]);