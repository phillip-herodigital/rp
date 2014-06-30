// This extends the Angular UI Bootstrap datepicker-popup directive
// https://github.com/angular/angular.js/wiki/Understanding-Directives#extending-directives
ngApp.directive('datepickerPopup', [function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            scope.openDatePicker = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                scope.datePickerOpened = true;
            };
        }
    };
}]);