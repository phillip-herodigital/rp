// This is a simple directive to allow initial setting of an ngModel using the "value" attribute on any element - including text areas and select boxes.
// Default angular behavior ignores the "value" attribute if a "ng-model" is provided.
ngApp.directive('value', function ($parse) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs) {
            if (attrs.ngModel && attrs.value && (attrs.type.toLowerCase() != 'radio' || attrs.checked)) {
                $parse(attrs.ngModel).assign(scope, attrs.value);
            }
        }
    };
});