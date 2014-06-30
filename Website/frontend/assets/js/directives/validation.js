ngApp.directive('val', ['validation', function (validation) {
    // Attribute to run validation on an element
    var link = function (scope, element, attrs, ngModelController) {
        if (attrs['val'] != 'true')
            return;

        var validationFor = attrs['name'];

        // If suppress is true, don't actually display any validation messages.
        var validators = validation.buildValidation(scope, element, attrs, ngModelController);


        ngModelController.$parsers.unshift(validators.runValidations);
        ngModelController.$formatters.unshift(validators.runValidations);

        var watches = [
            // Watch to see if the hasCancelledSuppress is set to true and, if it is, cancel our own suppression.
            scope.$watch(validation.hasCancelledSuppress, function (newValue) {
                if (newValue)
                    validators.cancelSuppress();
            })
        ];

        if (attrs['valIf'])
        {
            // watch our "valIf" expression and, if it becomse falsy, turn off all of our validations.
            watches.push(scope.$watch(attrs['valIf'], function (newValue, oldValue) {
                if (newValue)
                    validators.enable();
                else
                    validators.disable();
            }));
        }
        else
        {
            validators.enable();
        }

        // Make sure we dispose all our 
        element.on('$destroy', function () {
            delete validation.clearDotNetName(scope, validationFor);

            for (var key in watches)
                watches[key]();
        });

        // Cancel suppression of error messages for this element on blur
        element.on('blur', function () {
            validators.cancelSuppress();
            scope.$digest();
        });

        if (!attrs.hasOwnProperty('valRealtime')) {
            element.on('focus', function () {
                validators.enableSuppress();
            });
        }
        else {
            element.on('focus', function () {
                validators.cancelSuppress();
                scope.$digest();
            });
        }
    };

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
}]).directive('form', ['validation', function (validation) {

    return {
        restrict: 'E',
        scope: true,
        link: function (scope) {
            // Add the $$validation object at the form level so that we don't end up adding it
            // at an inner level, such as an ng-if.
            validation.ensureValidation(scope);
        }
    };
}]).directive('valSubmit', ['validation', function (validation) {
    return {
        restrict: 'A',
        require: '^?form',
        link: function (scope, element, attrs, ctrl) {
            element.on('click', function ($event) {
                if (ctrl.$invalid) {
                    $event.preventDefault();
                    validation.showValidationSummary = true;
                    // Cancels the suppression of validation messages, which reveals error classes, validation summaries, etc.
                    validation.cancelSuppress(scope);
                    scope.$digest();
                }
            });

            var watches = [
                scope.$watch(function () { return ctrl.$invalid }, function (newValue) {
                    if (newValue)
                        element.addClass('disabled');
                    else
                        element.removeClass('disabled');
                })
            ];

            element.on('$destroy', function () {
                for (var key in watches)
                    watches[key]();
            });
        }
    }
}]);