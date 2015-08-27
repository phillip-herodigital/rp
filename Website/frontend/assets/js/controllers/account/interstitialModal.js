/* Interstitial Modal Controller
 *
 */

ngApp.controller('ctrlInterstitialModal', ['$scope', '$modal', '$http', function ($scope, $modal, $http) {
    $scope.executeInterstitialModal = function (itemName) {
        $http.get('/account/interstitials/' + itemName)
        .success(function (data) {
            if (data != '') {
                $modal.open({
                    scope: $scope,
                    template: data,
                });
            }
        })
    };
}]);