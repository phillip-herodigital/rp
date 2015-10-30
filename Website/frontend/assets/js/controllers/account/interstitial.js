/* Interstitial Modal Controller
 *
 */

ngApp.controller('AcctInterstitialCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    
    $scope.dismissInterstitial = function (itemId) {
        var interstitialData = {
            interstitialId: itemId
        };
        $http.post('/api/account/dismissInterstitial', interstitialData)
        .success(function (data) {
            $window.location.href = '/account';
        })
    };

}]);