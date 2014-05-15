/// <reference path="../libs/angular/angular.js" />

ngApp.provider('validation', [function () {
    var validators = {};

    this.$get = ['$injector', function ($injector) {
        var svc = {
            getValidator: function (validatorName) {
                if (!validators[validatorName].injected && validators[validatorName].$inject) {
                    validators[validatorName].injected = [];
                    angular.forEach(validators[validatorName].$inject, function (name) {
                        validators[validatorName].injected[name] = $injector.get(name);
                    });
                }
                return validators[validatorName];
            },
            ensureValidation: function (scope) {
                scope.validation = scope.validation || { cancelSuppress: false, messages: {}, data: {} };
                return scope.validation;
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
        validate.$inject = inject;
        validators[validatorName] = validate;        
    };
}]).config(['validationProvider', '$injector', function (validationProvider, $injector)
{

    function getModelPrefix(fieldName) {
        return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
    }

    function appendModelPrefix(value, prefix) {
        if (value.indexOf("*.") === 0) {
            value = value.replace("*.", prefix);
        }
        return value;
    }

    validationProvider.addValidator('required', function (val) { return !!val; });
    validationProvider.addValidator('regex', function (val, options) {
        return !val || new RegExp(options.parameters['pattern']).exec(val);
    });
    validationProvider.addValidator('email', function (val) {
        // regex taken from jquery.validate v1.12.0
        // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
        // Retrieved 2014-01-14
        // If you have a problem with this implementation, report a bug against the above spec
        // Or use custom methods to implement your own email validation
        return !val || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(val);
    });
    validationProvider.addValidator("creditcard", function (value) {
        if (!value)
            return true;
        // regex taken from jquery.validate v1.12.0
        // accept only spaces, digits and dashes
        if (/[^0-9 \-]+/.test(value)) {
            return false;
        }
        var nCheck = 0,
            nDigit = 0,
            bEven = false,
            n, cDigit;

        value = value.replace(/\D/g, "");

        // Basing min and max length on
        // http://developer.ean.com/general_info/Valid_Credit_Card_Types
        if (value.length < 13 || value.length > 19) {
            return false;
        }

        for (n = value.length - 1; n >= 0; n--) {
            cDigit = value.charAt(n);
            nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if ((nDigit *= 2) > 9) {
                    nDigit -= 9;
                }
            }
            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) === 0;
    });
    validationProvider.addValidator("date", function (val) {
        if (!val)
            return true;
        return !/Invalid|NaN/.test(new Date(val).toString());
    });
    validationProvider.addValidator("digits", function (val) {
        if (!val)
            return true;
        return /^\d+$/.test(val);
    });
    validationProvider.addValidator("number", function (val) {
        if (!val)
            return true;
        return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(val);
    });
    validationProvider.addValidator("url", function (val) {
        if (!val)
            return true;
        // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(val);
    });
    validationProvider.addValidator("minlength", function (val, options) {
        if (!val)
            return true;
        return val.length >= options.parameters.min;
    });
    validationProvider.addValidator("maxlength", function (val, options) {
        if (!val)
            return true;
        return val.length <= options.parameters.max;
    });
    validationProvider.addValidator("length", function (val, options) {
        if (!val)
            return true;
        return val.length >= options.parameters.min &&  val.length <= options.parameters.max;
    });
    validationProvider.addValidator("range", function (val, options) {
        if (!val)
            return true;
        
        var value = parseFloat(val);
        return value <= options.parameters.max && value >= options.parameters.min;
    });
    validationProvider.addValidator("password", function (val, options) {
        function nonalphamin (value, min) {
            var match = value.match(/\W/g);
            return match && match.length >= min;
        }
        if (!val)
            return true;
        return (!options.parameters.min || val.length >= options.parameters.min)
            && (!options.parameters.nonalphamin || nonalphamin(val, options.parameters.nonalphamin))
            && (!options.parameters.regex || !!(new RegExp(options.parameters.regex).exec(val)));
    });
    validationProvider.addValidator("equalto", function (val, options) {
        var prefix = getModelPrefix(options.attributes.name),
            other = options.parameters.other,
            fullOtherName = appendModelPrefix(other, prefix),
            element = options.injected.validation.dataValue(options.scope, fullOtherName);

        return element == val;
    }, ['validation']);
    validationProvider.addValidator("extension", function (val, options) {
        if (!val)
            return true;
        var param = typeof options.parameters.extension == "string" ? options.parameters.extension.replace(/,/g, '|') : "png|jpe?g|gif";
		return val.match(new RegExp(".(" + param + ")$", "i"));
    });
    validationProvider.addValidator("remote", function (val, options) {
        if (options.ngModel.remoteTimeout)
            options.ngModel.remoteTimeout.resolve();
        if (!val)
            return true;

        var prefix = getModelPrefix(options.attributes.name);
        var data = {};
        angular.forEach((options.parameters.additionalfields || options.attributes.name).split(','), function (fieldName) {
            var dataName = appendModelPrefix(fieldName, prefix);
            data[dataName] = options.injected.validation.dataValue(options.scope, dataName);
        });

        var timeout = options.injected.$q.defer();
        options.ngModel.remoteTimeout = timeout;
        options.injected.$http({
                                   method: options.parameters.type,
                                   url: options.parameters.url,
                                   data: data,
                                   cache: true, // we may want this off... but it should save repeated calls to our back-end
                                   timeout: timeout.promise
        }).success(function (response, status)
        {
            if (response !== true && response !== "true")
                options.ngModel.$setValidity('remote', false);
        });
        return true;
    }, ['validation', '$http', '$q']);
}]);