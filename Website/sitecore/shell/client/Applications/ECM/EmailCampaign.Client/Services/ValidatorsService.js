define(['sitecore'], function (sitecore) {
  var validators = {
    required: {
      method: function (value) {
        return value && value.length > 0;
      }
    },

    trimRequired: {
      method: function (value) {
        return validators.required.method($.trim(value));
      }
    },

    email: {
      method: function (value) {
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
      }
    },

    url: {
      method: function (value) {
        return /^(http|https){1}\:\/\/(([a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]?)\.)*([a-zA-Z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?)(:\d{2,5})?(\/[a-zA-Z0-9][A-Za-z0-9\-]{0,61}[A-Za-z0-9]?)*(\/{1})?$/.test(value);
      }
    },

    expression: {
      method: function (value, params) {
        var re = new RegExp(params.expression);
        return re.test(value);
      }
    },

    minLength: {
      method: function (value, params) {
        return value.length >= params.min;
      }
    },

    maxLength: {
      method: function (value, params) {
        return value.length <= params.max;
      }
    },

    summaryMax: {
      method: function (values, params) {
        var textSummary = values.join('');
        return validators.maxLength.method(textSummary, params);
      }
    },
    numMin: {
      method: function(value, params) {
        return typeof value === 'number' && value >= params.min;
      }
    },
    numMax: {
      method: function(value, params) {
        return typeof value === 'number' && value <= params.max;
      }
    },

    // EXM specific rules
    nameIsValid: {
      method: function (value, params, input) {
        params = _.extend({ max: 100 }, params);
        return this.validate(value,
          {
            required: {
              message: sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.NameRequired")
            },
            trimRequired: {
              message: sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.NameTrimRequired")
            },
            expression: {
              message: sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.IsNotValidName").replace(/\{0\}/gi, value),
              params: params
            },
            max: {
              message: sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.NameMaxLength"),
              params: params
            }
          }, input);
      },
      silent: true
    }
  },

  messages = {
    default: ''
  };

  var ValidatorsService = {
    validators: validators,
    messages: messages,
    addMessages: function(messages) {
      $.extend(true, ValidatorsService.messages, messages);
    },
    addValidators: function (validators) {
      $.extend(true, ValidatorsService.validators, validators);
    }
  }

  return ValidatorsService;
});