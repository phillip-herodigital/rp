ngApp.provider('validation', [function () {
    var validators = {};

    this.$get = function () {
        var svc = {
            getValidator: this.getValidator,
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
    };

    this.getValidator = function (validatorName) {
        return validators[validatorName];
    };

    this.addValidator = function (validatorName, validate) {
        validators[validatorName] = validate;
    };
}]).config(['validationProvider', function(validationProvider)
{
    validationProvider.addValidator('required', function (val) { return !!val; });
    validationProvider.addValidator('regex', function (val, parameters) {
        return !val || new RegExp(parameters['pattern']).exec(val);
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
    validationProvider.addValidator("minlength", function (val, params) {
        if (!val)
            return true;
        return val.length >= params.min;
    });
    validationProvider.addValidator("maxlength", function (val, params) {
        if (!val)
            return true;
        return val.length <= params.max;
    });
    validationProvider.addValidator("length", function (val, params) {
        if (!val)
            return true;
        return val.length >= params.min &&  val.length <= params.max;
    });
    validationProvider.addValidator("range", function (val, params) {
        if (!val)
            return true;
        
        var value = parseFloat(val);
        return value <= params.max && value >= params.min;
    });
    validationProvider.addValidator("password", function (val, params) {
        function nonalphamin (value, min) {
            var match = value.match(/\W/g);
            return match && match.length >= min;
        }
        if (!val)
            return true;;
        return (!params.min || val.length >= params.min)
            && (!params.nonalphamin || nonalphamin(val, params.nonalphamin))
            && (!params.regex || !!(new RegExp(params.regex).exec(val)));
    });
    
    /*
    
    if ($jQval.methods.extension) {
        adapters.addSingleVal("accept", "mimtype");
        adapters.addSingleVal("extension", "extension");
    } else {
        // for backward compatibility, when the 'extension' validation method does not exist, such as with versions
        // of JQuery Validation plugin prior to 1.10, we should use the 'accept' method for
        // validating the extension, and ignore mime-type validations as they are not supported.
        adapters.addSingleVal("extension", "extension", "accept");
    }

    adapters.add("equalto", ["other"], function (options) {
        var prefix = getModelPrefix(options.element.name),
            other = options.params.other,
            fullOtherName = appendModelPrefix(other, prefix),
            element = $(options.form).find(":input").filter("[name='" + escapeAttributeValue(fullOtherName) + "']")[0];

        setValidationValues(options, "equalTo", element);
    });
    adapters.add("remote", ["url", "type", "additionalfields"], function (options) {
        var value = {
            url: options.params.url,
            type: options.params.type || "GET",
            data: {}
        },
            prefix = getModelPrefix(options.element.name);

        $.each(splitAndTrim(options.params.additionalfields || options.element.name), function (i, fieldName) {
            var paramName = appendModelPrefix(fieldName, prefix);
            value.data[paramName] = function () {
                return $(options.form).find(":input").filter("[name='" + escapeAttributeValue(paramName) + "']").val();
            };
        });

        setValidationValues(options, "remote", value);
    });

    */
}]);