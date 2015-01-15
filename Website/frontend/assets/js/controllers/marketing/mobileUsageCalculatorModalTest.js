ngApp.controller('MobileUsageCalculatorModalTestCtrl', ['$scope', '$filter', '$modal', function ($scope, $filter, $modal) {

    $scope.showModal = function (templateUrl) {
        $modal.open({
            'scope': $scope,
            'templateUrl': templateUrl
        });
    };

}]);

