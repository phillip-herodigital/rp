ngApp.directive('val', ['validation', '$sce', function (validation, $sce) {
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
            if (key == 'val' || key == 'valIf' || key == 'valRealtime' || !startsWith(key, 'val'))
                continue;
            var handled = false;
            var keyName = camelCase(key.substr(3));
            for (var validator in validators) {
                if (startsWith(keyName, validator)) {
                    validators[validator].params[camelCase(keyName.substr(validator.length))] = attrs[key];
                    handled = true;
                    break;
                }
            }
            if (handled)
                continue;

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

        // If allowValidation is false, then don't run any validations or mark validity as false.
        var allowValidation = false;
        // If suppress is true, don't actually display any validation messages.
        var suppress = !validation.hasCancelledSuppress(scope);
        var validators = buildValidatorsFromAttributes(attrs);
        var validationMessages = [];

        function populateMessages() {
            if (!suppress)
                validation.messageArray(scope)[validationFor] = validationMessages;
        }

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
            populateMessages();
            return newValue;
        };

        ngModelController.$parsers.unshift(runValidations);
        ngModelController.$formatters.unshift(runValidations);

        var watches = [
            // Watch to see if the hasCancelledSuppress is set to true and, if it is, cancel our own suppression.
            scope.$watch(validation.hasCancelledSuppress, function (newValue) {
                suppress = suppress && !newValue;
                populateMessages();
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
        else
        {
            allowValidation = true;
        }

        // Make sure we dispose all our 
        element.on('$destroy', function () {
            delete validation.messageArray(scope)[validationFor];

            for (var key in watches)
                watches[key]();
        });

        // Cancel suppression of error messages for this element on blur
        element.on('blur', function () {
            suppress = false;
            populateMessages();
            scope.$digest();
        });

        if (!attrs.hasOwnProperty('valRealtime')) {
            element.on('focus', function () {
                suppress = true;
            });
        }
        else {
            element.on('focus', function () {
                suppress = false;
                populateMessage();
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