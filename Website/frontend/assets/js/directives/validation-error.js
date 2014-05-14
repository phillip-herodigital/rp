ngApp.directive('valError', ['validation', function (validation) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var disposeWatch = scope.$watch(validation.messageArray + '["' + attrs['valError'] + '"]', function (newValue) {
                if (newValue && newValue.length) {
                    element.addClass('error');
                }
                else {
                    element.removeClass('error');
                }
            });

            element.on('$destroy', function () {
                disposeWatch();
            });
        }
    };
}]);
