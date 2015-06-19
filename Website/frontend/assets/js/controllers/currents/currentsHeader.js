/* Currents Header Controller
 *
 */
ngApp.controller('CurrentsHeaderCtrl', ['$scope', '$window', function ($scope, $window) {
    $scope.searchCurrents = function () {
        $window.location.href = '/currents/search?term=' +  encodeURIComponent($scope.searchTerm);
    };
}]);