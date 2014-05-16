ngApp.directive('valError', ['validation', function (validation) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var disposeWatch = scope.$watchCollection(function () { return validation.messageArray(scope, attrs['valError']) }, function (newValue) {
                if (newValue && Object.keys(newValue).length) {
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
