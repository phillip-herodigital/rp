ngApp.directive('streamConnectErrors', ['$parse', function ($parse) {
    return {
        templateUrl: '/templates/stream-connect-errors',
        restrict: 'AEC',
        controller: ['$scope', function ($scope) {
            var ctrl = this;
        }],
        scope: true,
    };
}]);