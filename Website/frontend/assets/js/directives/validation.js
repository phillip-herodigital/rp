﻿ngApp.directive('val', ['validation', '$compile', '$sce', function (validation, $compile, $sce) {
    var validationId = 0;

    function startsWith(string, start) { return string.slice(0, start.length) == start; };
    function camelCase(string) { return string.charAt(0).toLowerCase() + string.slice(1); };

    var buildValidatorsFromAttributes = function (attrs) {
        var keys = Object.keys(attrs).sort();
        var validators = {};
        for (var index in keys) {
            var key = keys[index];
            if (key == 'val' || key == 'valName' || key == 'valIf' || !startsWith(key, 'val'))
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

        var validationFor = attrs['valName'];
        scope.$$validation = scope.$$validation || {};

        var allowValidation = false;

        var validators = buildValidatorsFromAttributes(attrs);
        var runValidations = function (newValue) {
            scope.$$validation[validationFor] = [];
            for (var key in validators) {
                if (allowValidation && !validators[key].validate(newValue, validators[key].params)) {
                    ngModelController.$setValidity(key, false);
                    scope.$$validation[validationFor].push($sce.trustAsHtml(validators[key].message));
                }
                else {
                    ngModelController.$setValidity(key, true);
                }
            }
        };

        ngModelController.$parsers.unshift(runValidations);

        scope.$watch(attrs['valIf'], function (newValue, oldValue) {
            allowValidation = !!newValue;
            runValidations(element.val());
        });

        element.on('$destroy', function () {
            scope.$$validation[validationFor] = undefined;
        });
    };

    return {
        restrict: 'A',
        require: 'ngModel',
        link: link
    };
}]);

ngApp.directive('form', [function () {

    return {
        restrict: 'E',
        link: function (scope) {
            // add the $$validation object at the form level so that we don't end up adding it
            // at an inner level, such as an ng-if
            scope.$$validation = {};
        }
    };
}])