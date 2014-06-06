// This extends the Angular UI Bootstrap datepicker-popup directive
// https://github.com/angular/angular.js/wiki/Understanding-Directives#extending-directives
ngApp.directive('datepickerPopup', ['$window', 'breakpoint', function ($window, breakpoint) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {

            scope.openDatePicker = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                scope.datePickerOpened = true;
            };

            /*
            Close the datepicker on mobile resize, otherwise it gets out of alignment
            with the element that it's positioned with. 
            */
            if(attrs.datepickerCloseOnResize == '') {
                angular.element($window).bind('resize', function() {
                    if(scope.datePickerOpened && breakpoint.breakpoint.name == 'phone') {
                        scope.datePickerOpened = false;
                        scope.$apply();
                    }
                });
            }
        }
    };
}]);