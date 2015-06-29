/* Currents Post Controller
 *
 */
ngApp.controller('CurrentsPostCtrl', ['$scope', '$window', function ($scope, $window) {
    $scope.setActive = function(idx) {
        $scope.slides[idx].active=true;
    }
}]);