ngApp.directive('valError', ['validation', function (validation) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(validation.messageArray + '["' + attrs['valError'] + '"]', function (newValue) {
                if (newValue.length) {
                    element.addClass('error');
                }
                else {
                    element.removeClass('error');
                }
            });
        }
    };
}]);
