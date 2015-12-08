/* Interstitial Modal Controller
 *
 */

ngApp.controller('AcctInterstitialCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    
    $scope.pageHash = function (pageName) {
    	$window.location.hash = '##' + encodeURIComponent(pageName);
    };

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