ngApp.directive('ellipsis', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            $timeout(function() {
                element.dotdotdot({
                    watch: "window"
                });
            });
        }
    };
}]);