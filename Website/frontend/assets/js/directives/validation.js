﻿ngApp.directive('val', ['validation', '$sce', function (validation, $sce) {
    var validationId = 0;

    function startsWith(string, start) { return string.slice(0, start.length) == start; };
    function camelCase(string) { return string.charAt(0).toLowerCase() + string.slice(1); };

    // Aggregate our attributes for validation parameters. 
    // For example, valRegexPattern is a parameter of valRegex called "pattern".
    var buildValidatorsFromAttributes = function (attrs) {
        var keys = Object.keys(attrs).sort();
        var validators = {};
        for (var index in keys) {
            var key = keys[index];
            if (key == 'val' || key == 'valIf' || !startsWith(key, 'val'))
                continue;
            var handled = false;
            for (var validator in validators) {
                if (startsWith(key, validator)) {
                    validators[validator].params[camelCase(key.substr(validator.length))] = attrs[key];
                    handled = true;
                    break;
                }
            }
            if (handled)
                continue;

            var keyName = camelCase(key.substr(3));
            var validate = validation.getValidator(keyName);
            if (validate) {
                validators[keyName] = {
                    name: keyName,
                    validate: validate,
                    message: attrs[key],
                    params: []
                };
            }
            else {
                console.log('WARNING: Unhandled validation attribute: ' + keyName);
            }
        }
        return validators;
    };

    // Attribute to run validation on an element
    var link = function (scope, element, attrs, ngModelController) {
        // TODO - consider $observe-ing the attributes
        if (attrs['val'] != 'true')
            return;

        var validationFor = attrs['name'];
        // Assuming this is inside a <form>, thos shouldn't really be necessary.
        scope[validation.messageArray] = scope[validation.messageArray] || {};

        // If allowValidation is false, then don't run any validations or mark validity as false.
        var allowValidation = false;
        // If suppress is true, don't actually display any validation messages.
        var suppress = !scope[validation.cancelSuppress];
        var validators = buildValidatorsFromAttributes(attrs);
        var validationMessages = [];

        var runValidations = function (newValue) {
            validationMessages = [];
            // Run validations for all of our client-side validation and store in a local array.
            for (var key in validators) {
                if (allowValidation && !validators[key].validate(newValue, validators[key].params)) {
                    ngModelController.$setValidity(key, false);
                    validationMessages.push($sce.trustAsHtml(validators[key].message));
                }
                else {
                    ngModelController.$setValidity(key, true);
                }
            }
            // If we're not suppressing, share the validation messages.
            if (!suppress)
                scope[validation.messageArray][validationFor] = validationMessages;
        };

        ngModelController.$parsers.unshift(runValidations);

        var watches = [
            // Watch to see if the cancelSuppress is set to true and, if it is, cancel our own suppression.
            scope.$watch(validation.cancelSuppress, function (newValue) {
                suppress = suppress && !scope[validation.cancelSuppress];
                if (!suppress)
                    scope[validation.messageArray][validationFor] = validationMessages;
            })
        ];

        if (attrs['valIf'])
        {
            // watch our "valIf" expression and, if it becomse falsy, turn off all of our validations.
            watches.push(scope.$watch(attrs['valIf'], function (newValue, oldValue) {
                allowValidation = !!newValue;
                runValidations(element.val());
            }));
        }

        // Make sure we dispose all our 
        element.on('$destroy', function () {
            delete scope[validation.messageArray][validationFor];

            for (var key in watches)
                watches[key]();
        });

        // Cancel suppression of error messages for this element on blur
        element.on('blur', function () {
            suppress = false;
            scope[validation.messageArray][validationFor] = validationMessages;
            scope.$digest();
        });
    };

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
}]).directive('form', ['validation', function (validation) {

    return {
        restrict: 'E',
        link: function (scope) {
            // Add the $$validation object at the form level so that we don't end up adding it
            // at an inner level, such as an ng-if.
            scope[validation.messageArray] = {};
            scope[validation.cancelSuppress] = false;
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
                    // Cancels the suppression of validation messages, which reveals error classes, validation summaries, etc.
                    scope[validation.cancelSuppress] = true;
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