// This extends the Angular UI Bootstrap datepicker-popup directive
// https://github.com/angular/angular.js/wiki/Understanding-Directives#extending-directives
ngApp.directive('datepickerPopup', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            scope.showFooter = attrs.showFooter || false; // Setting this here, so we can access from datepickerPopupWrap later

            scope.openDatePicker = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                scope.datePickerOpened = true;
            };
        }
    };
}]);

ngApp.directive('datepickerPopupWrap', [function () {
    return {
        restrict: 'EA',
        link: function (scope, element, attrs) {
            
            // Probably not ideal, but not sure of a better way to get access...
            scope.showFooter = scope.$parent.showFooter;
            scope.hasAnyPriority = scope.$parent.hasAnyPriority || function () { return true; };
        }
    };
}]);