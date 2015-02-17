ngApp.controller('esnActivationController', ['$scope', '$http', function ($scope, $http) {
    var activationCtrl = this;
    this.activationCode = null;

    $scope.$watch(function () { return activationCtrl.activationCode; }, function () {
        activationCtrl.success = undefined;
        activationCtrl.failure = undefined;
    })

    this.activate = function () {
        activationCtrl.lastCode = activationCtrl.activationCode;
        activationCtrl.isLoading = true;
        $http.post('/api/mobileActivation/activateEsn', activationCtrl.activationCode)
            .success(function (data) {
                activationCtrl.isLoading = false;
                if (JSON.parse(data))
                    activationCtrl.success = true;
                else
                    activationCtrl.failure = true;
            })
            .error(function (data) {
                activationCtrl.isLoading = false;
                activationCtrl.failure = true;
            });
        activationCtrl.activationCode = null;
    }

    this.uploadFile = null;

    $scope.$watch(function () { return activationCtrl.uploadFile; }, function () {
        activationCtrl.uploadSuccess = undefined;
        activationCtrl.uploadFailure = undefined;
    })

    this.upload = function () {
        activationCtrl.lastFileName = activationCtrl.uploadFile[0].name;
        activationCtrl.isLoading = true;
        $http.post('/api/mobileActivation/uploadActivationCodes', activationCtrl.uploadFile[0], { 'headers': { 'Content-Type': activationCtrl.uploadFile[0].type }, transformRequest: angular.identity })
            .success(function (data) {
                activationCtrl.isLoading = false;
                if (JSON.parse(data))
                    activationCtrl.uploadSuccess = true;
                else
                    activationCtrl.uploadFailure = true;
            })
            .error(function (data) {
                activationCtrl.isLoading = false;
                activationCtrl.uploadFailure = true;
            });
        activationCtrl.uploadFile = null;
    }
}]);