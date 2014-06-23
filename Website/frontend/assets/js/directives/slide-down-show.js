// Slide Toggle
ngApp.directive('slideDownShow', [function () {
    return {
        restrict: 'A',
        scope: { 'slideDownShow': '=', 'duration': '=' },
        link: function (scope, element, attrs) {
            // element is already a jQuery object, so we can just use the jQuery animation functions automatically

            var currentState = scope.slideDownShow;
            if (!currentState)
                element.hide();
            var duration = scope.duration || 1000;

            scope.$watch('slideDownShow', function (val) {
                console.log(duration, val);

                if (val)
                    element.slideDown(duration);
                else
                    element.slideUp(duration);
                currentState = val;
            });
            scope.$watch('duration', function (val) {
                duration = val || 1000;
            });
        }
    };
}]);