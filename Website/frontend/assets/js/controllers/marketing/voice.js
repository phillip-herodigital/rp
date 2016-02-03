ngApp.controller('voiceCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.showHubFeatures = false;
    $scope.bundleLink = "";
    $scope.hubLink = "https://shop-stream-peck.ooma.com/cart?offer=STREAM_HUB&sales_source=xyz&associate_a_number=1234&free_sponsorship_id=8r8r8";
    $scope.airLink = "https://shop-stream-peck.ooma.com/cart?offer=STREAM_HUB_AIR&sales_source=xyz&associate_a_number=1234&free_sponsorship_id=8r8r8";
    $scope.bridgeLink = "https://shop-stream-peck.ooma.com/cart?offer=STREAM_HUB_BRIDGE&sales_source=xyz&associate_a_number=1234&free_sponsorship_id=8r8r8";
}]);
