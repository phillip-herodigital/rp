ngApp.controller('esnActivationUploadController', ['$scope', '$http', function ($scope, $http) {
    var activationCtrl = this;

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