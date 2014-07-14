ngApp.directive('currencyInput', ['$filter', function($filter) {
    return {
      require: '?ngModel',
      link: function($scope, element, attrs, ctrl) {

        ctrl.$formatters.push(function(inputValue) {
          return $filter('currency')(inputValue, '');
        });

        element.bind('blur', function() {
          ctrl.$setViewValue($filter('currency')(element[0].value, ''));
          ctrl.$render();
        });
      }
    };
}]);