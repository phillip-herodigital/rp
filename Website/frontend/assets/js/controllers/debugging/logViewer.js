ngApp.controller('LogViewerCtrl', ['$scope', '$window', '$http', '$q', function ($scope, $window, $http, $q) {
    $scope.mode = 'simple';
    $scope.$watch('mode', function (newValue) {
        $scope.isSimple = newValue == 'simple';
        $scope.isAdvanced = newValue == 'advanced';
    });

    $scope.selectedIndexes = [];
    $scope.indexes = [];
    $scope.logs = [];
    $scope.related = [];
    $scope.form = {};
    $scope.setServerData = function (indexes) {
        $scope.selectedIndexes = indexes;
        $http.get('/api/logViewer/indexes').success(function (data) {
            $scope.indexes = data;
        });
        $scope.update();
    }

    $scope.findRelated = function () {
        $http.post('/api/logViewer/related/', toIndexData()).success(function (data) {
            $scope.logs = [];
            $scope.related = data;
        });
    }
    $scope.update = function () {
        $http.post('/api/logViewer/logs/', toIndexData()).success(function (data) {
            $scope.related = [];
            $scope.logs = data;
        });
    }
    $scope.abandon = function () {
        $window.location.href = '?sessionAbandon=true';
    }

    $scope.findValues = function (key, value) {
        var promise = $q.defer();
        $http.get('/api/logViewer/indexes/' + key + '?startsWith=' + value).success(function (data) {
            promise.resolve(data);
        });

        return promise.promise;
    }

    function toIndexData() {
        return _.reduce($scope.selectedIndexes, function (result, entry) { result[entry.key] = _.pluck(entry.values, 'value'); return result; }, {});
    }
}]);