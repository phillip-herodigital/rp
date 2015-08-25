/* Interstitial Modal Controller
 *
 */

ngApp.controller('ctrlInterstitialModal', ['$scope', '$modal', function ($scope, $modal) {
    $scope.executeInterstitialModal = function ($modelname) {
        var m = $('script[data-ng-controller]');
        var n = m[m.length - 1].attributes['data-modelname'].value;
        //alert($modelname + " :: " + n);
        if($modelname == n)
        {
            $modal.open({
                scope: $scope,
                'templateUrl': 'tmplInterstitialModal'
            })
        }
    };
}]);