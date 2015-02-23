ngApp.controller('LogViewerCtrl', ['$scope', '$window', '$http', '$q', '$timeout', function ($scope, $window, $http, $q, $timeout) {
    $scope.hidden = {};
    $scope.mode = 'simple';
    $scope.$watch('mode', function (newValue) {
        $scope.isSimple = newValue == 'simple';
        $scope.isAdvanced = newValue == 'advanced';
    });

    $scope.needsUpdate = true;
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
    $scope.$watch('selectedIndexes', function () {
        $scope.needsUpdate = true;
    }, true)

    $scope.findRelated = function () {
        $http.post('/api/logViewer/related/', toIndexData()).success(function (data) {
            $scope.logs = [];
            $scope.related = data;
        });
    }
    $scope.update = function () {
        $timeout(function () {
            $scope.needsUpdate = false;
        })
        $scope.hidden = {};
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

    $scope.addIndex = function (key, value) {
        var entry = _.find($scope.selectedIndexes, { key: key });
        if (entry == null) {
            entry = { key: key, values: [] };
            $scope.selectedIndexes.push(entry);
        }
        if (!_.find(entry.values, { value: value })) {
            entry.values.push({ value: value });
        }
    }

    function toIndexData() {
        return _.reduce($scope.selectedIndexes, function (result, entry) { result[entry.key] = _.pluck(entry.values, 'value'); return result; }, {});
    }

    $scope.findKey = function (item, key) {
        return _.find(item.indexes, { 'key': key });
    }

    $scope.hasIndex = function (key, value) {
        var keyContainer = _.find($scope.selectedIndexes, { 'key': key });
        if (keyContainer != null) {
            return !!_.find(keyContainer.values, { 'value': value });
        }
        return false;
    };

    $scope.againstHidden = function (logEntry) {
        for (var i in logEntry.indexes) {
            var index = logEntry.indexes[i];
            if ($scope.hidden[index.key]) {
                return !_.intersection($scope.hidden[index.key], index.value).length;
            }
        }
        return true;
    };

    $scope.hideRelated = function (key, value) {
        $scope.hidden[key] = $scope.hidden[key] || [];
        $scope.hidden[key].push(value);
    };
}]);