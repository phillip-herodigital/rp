/* Interstitial Modal Controller
 *
 */

ngApp.controller('ctrlInterstitialModal', ['$scope', '$modal', '$http', function ($scope, $modal, $http) {
    
    $scope.modalInstance = {};

    $scope.executeInterstitialModal = function (itemName) {
        $http.get('/account/interstitials/' + itemName)
        .success(function (data) {
            if (data != '') {
                $scope.modalInstance = $modal.open({
                    scope: $scope,
                    template: data,
                });
            }
        })
    };

    $scope.dismissInterstitialModal = function (itemId) {
        var interstitialData = {
            interstitialId: itemId
        };
        $http.post('/api/account/dismissInterstitialModal', interstitialData)
        .success(function (data) {
            $scope.modalInstance.close();
        })
    };

}]);