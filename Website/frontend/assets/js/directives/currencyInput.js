ngApp.directive('currencyInput', ['$filter', function($filter) {
    return {
        require: '?ngModel',
        link: function($scope, element, attrs, ctrl) {

            ctrl.$formatters.push(function(inputValue) {
                return $filter('currency')(inputValue, '');
            });

            ctrl.$parsers.push(function (viewValue) {
                return viewValue.replace(/,/g, '');
            });

            element.bind('blur', function () {
                ctrl.$setViewValue($filter('currency')(ctrl.$modelValue, ''));
                ctrl.$render();
            });
        }
    };
}]);