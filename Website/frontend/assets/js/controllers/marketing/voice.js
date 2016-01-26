ngApp.controller('voiceCtrl', ['$scope', '$http', function ($scope, $http) {

    $scope.showHubFeatures = false;

    $scope.toggleHubFeatures = function () {
        if ($scope.showHubFeatures) {
            $scope.showHubFeatures = false;
            document.getElementById('slidingText').classList.remove('slideIn');
            document.getElementById('slidingText').classList.add('slideOut');
            document.getElementById('dropDownImage').classList.remove('rotate180');
            document.getElementById('dropDownImage').classList.add('rotate0');

        }
        else {
            $scope.showHubFeatures = true;
            document.getElementById('slidingText').classList.remove('slideOut');
            document.getElementById('slidingText').classList.add('slideIn');
            document.getElementById('dropDownImage').classList.add('rotate180');
            document.getElementById('dropDownImage').classList.remove('rotate0');
        }
    }
}]);
