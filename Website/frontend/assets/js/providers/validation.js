/// <reference path="../libs/angular/angular.js" />

ngApp.provider('validation', [function () {
    var validationTypes = {};

    this.$get = ['$injector', '$sce', function ($injector, $sce) {
        function startsWith(string, start) { return string.slice(0, start.length) == start; };
        function camelCase(string) { return string.charAt(0).toLowerCase() + string.slice(1); };

        function getValidationType(validatorName) {
            return validationTypes[validatorName];
        };

        // Aggregate our attributes for validation parameters. 
        // For example, valRegexPattern is a parameter of valRegex called "pattern".
        function buildValidatorsFromAttributes(attrs, tools, scope, ngModel) {
            var keys = Object.keys(attrs).sort();
            var result = {};
            angular.forEach(keys, function(key) {
                if (key == 'val' || key == 'valIf' || key == 'valRealtime' || !startsWith(key, 'val'))
                    return;
                var handled = false;
                if (key.substr(3).charAt(0).toLowerCase() == key.substr(3).charAt(0)) {
                    // Check to make sure the next character is an upper-case character... keeps us from capturing data-value and things like that.
                    return;
                }
                var keyName = camelCase(key.substr(3));
                angular.forEach(result, function (validator, validatorName) {
                    if (startsWith(keyName, validatorName)) {
                        validator.parameters[camelCase(keyName.substr(validatorName.length))] = attrs[key];
                        handled = true;
                        return;
                    }
                });
                if (handled)
                    return;

                var validate = getValidationType(keyName);
                if (validate) {
                    result[keyName] = {
                        name: keyName,
                        validate: validate.validate,
                        message: $sce.trustAsHtml(attrs[key]),
                        parameters: [],
                        injected: {},
                        attributes: attrs,
                        scope: scope,
                        ngModel: ngModel,
                        fail: function (message) { tools.fail(keyName, message); },
                        pass: function () { tools.pass(keyName); }
                    };
                    if (validate.inject) {
                        angular.forEach(validate.inject, function (name) {
                            result[keyName].injected[name] = $injector.get(name);
                        });
                    }
                }
                else {
                    console.log('WARNING: Unhandled validation attribute: ' + keyName);
                }
            });
            return result;
        };

        var svc = {
            ensureValidation: function (scope) {
                scope['$$ validation'] = scope['$$ validation'] || { cancelSuppress: false, messages: {}, data: {} };
                return scope['$$ validation'];
            },
            buildValidation: function (scope, element, attrs, ngModelController) {
                var validationEnabled = true;
                var validationFor = attrs['name'];
                ngModelController.suppressValidationMessages = true;
                ngModelController.validationMessages = {};
                var validators;
                
                var result = {
                    enable: function () {
                        validationEnabled = true;
                        result.runValidations(svc.dataValue(scope, validationFor));
                        result.populateMessages();
                    },
                    disable: function () {
                        validationEnabled = false;
                        ngModelController.validationMessages = {};
                        angular.forEach(validators, function (value, key) {
                            result.pass(key);
                        })
                        result.populateMessages();
                    },
                    populateMessages: function () {
                        if (!ngModelController.suppressValidationMessages) {
                            svc.messageArray(scope, validationFor, ngModelController.validationMessages);
                        }
                    },
                    runValidations: function (newValue) {
                        svc.dataValue(scope, validationFor, newValue);
                        if (validationEnabled) {
                            ngModelController.validationMessages = {};
                            // Run validations for all of our client-side validation and store in a local array.
                            angular.forEach(validators, function (value, key) {
                                if (!value.validate(newValue, value))
                                    value.fail();
                                else
                                    value.pass();
                            });
                            result.populateMessages();
                        }
                        return newValue;
                    },
                    cancelSuppress: function () {
                        ngModelController.suppressValidationMessages = false;
                        result.populateMessages();
                    },
                    enableSuppress: function () {
                        ngModelController.suppressValidationMessages = true;
                        // don't re-populate the messages here
                    },
                    fail: function (key, message) {
                        if (validationEnabled) {
                            ngModelController.$setValidity(key, false);
                            ngModelController.validationMessages[key] = message ? $sce.trustAsHtml(message) : (validators[key].message);
                        }
                    },
                    pass: function (key) {
                        ngModelController.$setValidity(key, true);
                    }
                };
                validators = buildValidatorsFromAttributes(attrs, result, scope, ngModelController);                
                return result;
            },
            messageArray: function (scope, dotNetName, setter) {
                if (dotNetName) {
                    if (setter !== undefined)
                        svc.ensureValidation(scope).messages[dotNetName] = setter;
                    return svc.ensureValidation(scope).messages[dotNetName];
                }
                return svc.ensureValidation(scope).messages;
            },
            dataValue: function (scope, dotNetName, setter) {
                if (dotNetName) {
                    if (setter !== undefined)
                        svc.ensureValidation(scope).data[dotNetName] = setter;
                    return svc.ensureValidation(scope).data[dotNetName];
                }
                return svc.ensureValidation(scope).data;
            },
            hasCancelledSuppress: function (scope) {
                return svc.ensureValidation(scope).cancelSuppress;
            },
            cancelSuppress: function (scope) {
                svc.ensureValidation(scope).cancelSuppress = true;
            },
            clearDotNetName: function (scope, dotNetName) {
                var validation = svc.ensureValidation(scope);
                delete svc.ensureValidation(scope).messages[dotNetName];
                delete svc.ensureValidation(scope).data[dotNetName];
            }
        };
        return svc;
    }];

    this.addValidator = function (validatorName, validate, inject) {
        validationTypes[validatorName] = { validate: validate, inject: inject };
    };
}]);