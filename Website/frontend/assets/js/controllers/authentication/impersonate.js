ngApp.controller('ImpersonateUserCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {

    $http.get('/api/streamauthentication/impersonateUserList' + $window.location.search).success(function (data) {
        $scope.usernames = data;
    }).error(function () {
        $window.location = '/';
    });

    $scope.select = function (username) {
        $window.location = '/api/streamauthentication/impersonate' + $window.location.search + '&username=' + username;
    }
}]);