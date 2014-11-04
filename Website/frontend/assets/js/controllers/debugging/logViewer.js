ngApp.controller('LogViewerCtrl', ['$scope', '$window', function ($scope, $window) {
    $scope.logs = [];
    //$scope.expand = [];
    $scope.form = {};
    $scope.setServerData = function (data, sessionID) {
        $scope.logs = data;
        $scope.form.sessionID = sessionID;
    }

    /*$scope.expandInnerTable = function (index) {
        $scope.expand[index] = !$scope.expand[index];
    }*/
    $scope.update = function () {
        $window.location.href = '?sessionID=' + $scope.form.sessionID;
    }
}]);