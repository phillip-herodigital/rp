define(['sitecore', 'backbone', '/-/speak/v1/ecm/ValidatorsService.js', '/-/speak/v1/ecm/ServerRequest.js'], function (sitecore, backbone, ValidatorsService, ServerRequest) {
  var defaults = {
    notifyEvent: 'validation.error',
    inputValidateEvent: 'change:text',
    highlightInput: true,
    highlightClass: 'has-error'
  };

  return backbone.Model.extend({
    initialize: function (options) {
      options = $.extend(true, {}, defaults, options || {});
      this.set('id', options.id || null);
      this.set('skip', options.skip || null);
      this.set('inputs', options.inputs || []);
      this.set('inputValidateEvent', options.inputValidateEvent);
      this.set('highlightInput', options.highlightInput);
      this.set('highlightClass', options.highlightClass);
      this.set('remotesInProgress', 0);
      this.set('errors', []);
      this.set('valid', true);
      this.set('isEnabled', true);
      this.on('change:errors', this.onChangeErrors, this);
    },

    onChangeErrors: function() {
      this.set('valid', !!!this.get('errors').length);
    },

    validateAll: function() {
      _.each(this.get('inputs'), _.bind(function(inputData) {
        var inputValue = this.getInputAttr(inputData.input, inputData.valueProp || 'text', inputData.trim);
        if (!this.isOptionalOrSkipped(inputData, inputValue)) {
          this.validate(inputValue, inputData.validators, inputData.input);
        }
      }, this));
      return this.get('valid');
    },

    isOptionalOrSkipped: function (inputData, inputValue) {
      if ((!inputValue && inputData.optional) || this.isSkipped(inputData.input)) {
        this.removeError(this.getMessageId(this.getInputName(inputData.input)), inputData.input);
        return true;
      }
      return false;
    },

    isSkipped: function (speakInput) {
      var skip = this.get('skip');
      if (!skip) {
        return false;
      }
      skip = $.type(skip) === 'array' ? skip : [skip];
      var skipped = false;
      speakInput = $.type(speakInput) === 'array' ? speakInput : [speakInput];
      for (var skipIndex in skip) {
        for (var inputIndex in speakInput) {
          var skipRule = skip[skipIndex],
            input = speakInput[inputIndex];

          switch ($.type(skipRule)) {
            case 'string':
              skipped = input.viewModel.$el.is(skipRule);
              break;
            case 'function':
              skipped = skipRule(input);
              break;
          }
          if (skipped) {
            return skipped;
          }
        }
      }
      return skipped;
    },

    prepareValidators: function(validators) {
      var validatorsPrepared = {};
      if (typeof validators === 'string') {
        validatorsPrepared[validators] = ValidatorsService.validators[validators] || {};
      } else {
        _.each(validators, function (validator, key) {
          if ($.type(validators) === 'array' && $.type(validator) === 'string') {
            validatorsPrepared[validator] = ValidatorsService.validators[validator] || {};
          } else if ($.type(validators) === 'object' && $.type(validator) === 'object') {
            validatorsPrepared[key] = $.extend(true, {}, ValidatorsService.validators[key] || {}, validator);
          }
        });
      }

      return validatorsPrepared;
    },

    getInputName: function(SpeakInput) {
      var inputName = SpeakInput ? this.getInputAttr(SpeakInput, 'name') : '';
      return $.type(inputName) === 'array' ? inputName.join("") : inputName;
    },

    validate: function(value, validators, SpeakInput) {
      validators = this.prepareValidators(validators);

      for (var rule in validators) {
        var validator = validators[rule],
          messageId = this.getMessageId(this.getInputName(SpeakInput), rule);
        if (rule === 'remote') {
          this.validateRemote(value, validator, SpeakInput);
        } else if (typeof validator.method === 'function') {
          var validatorMethod = _.bind(validator.method, this);
          if (!validatorMethod(value, this.getValidatorParams(validator), SpeakInput)) {
            if (!validator.silent) {
              this.addError(validator.message || ValidatorsService.messages[rule] || ValidatorsService.messages.default, messageId, SpeakInput);
            }
            return false;
          } else {
            if (!validator.silent) {
              this.removeError(messageId, SpeakInput);
            }
          }
        }
      }
      return true;
    },

    getValidatorParams: function(validator) {
      return $.type(validator.params) === 'function' ? validator.params() : validator.params;
    },

    validateRemote: function (value, validator, SpeakInput) {
      this.set('remotesInProgress', this.get('remotesInProgress') + 1);
      ServerRequest(_.extend({
        data: _.extend({ value: value }, this.getValidatorParams(validator)),
        success: _.bind(function(jqXHR) {
          var messageId = this.getMessageId(this.getInputName(SpeakInput), 'remote');
          if (jqXHR.error) {
            this.addError(jqXHR.errorMessage, messageId, SpeakInput);
          } else {
            this.removeError(messageId, SpeakInput);
          }
          this.set('remotesInProgress', this.get('remotesInProgress') - 1);
        }, this)
      }, validator.requestParams || {}));
    },

    findInputValidators: function (speakInput) {
      var validators = null;
      _.each(this.get('inputs'), function(inputData) {
        if (inputData.input === speakInput) {
          validators = inputData.validators;
        }
      });
      return validators;
    },

    validateInput: function(speakInput, validators) {
      validators = validators || this.findInputValidators(speakInput);
      this.validate(speakInput.get('text'), validators || {}, speakInput);
    },

    // if several inputs need to be validated with single rule, need to return array of attribute values
    getInputAttr: function(input, attr, trim) {
      var inputAttrValue;
      if ($.type(input) === 'array') {
        inputAttrValue = [];
        _.each(input, function (inputObj) {
          var value = inputObj.get(attr) ? inputObj.get(attr) : '';
          inputAttrValue.push(trim ? $.trim(value) : value);
        });
      } else {
        var value = input.get(attr);
        inputAttrValue = trim ? $.trim(value) : value;
      }
      return inputAttrValue;
    },

    getMessageId: function(inputName, rule) {
      return this.get('id') + (inputName ? '-' + inputName : '') + (rule ? '-' + rule : '');
    },

    setInputs: function(inputs) {
      // Workaround for backbone
      this.set('inputs', null, { silent: true });
      this.set('inputs', inputs);
    },

    addInput: function (inputData) {
      this.previousInputs = this.get('inputs').slice(0);
      var inputs = this.get('inputs'),
        inputExists = _.findWhere(inputs, { input: inputData.input });

      if (inputExists) {
        $.extend(true, inputExists.validators, inputData.validators);
      } else {
        inputs.push(inputData);
        this.setInputs(inputs);
      }
    },

    addInputs: function (inputs) {
      _.each(inputs, _.bind(function (input) {
        this.addInput(input);
      }, this));
    },

    removeInput: function(inputToRemove) {
      var inputs = this.get('inputs');
      inputs = _.filter(inputs, function (inputData) {
        return inputData.input !== inputToRemove;
      });
      this.setInputs(inputs);
    },

    removeInputs: function (inputs) {
      _.each(inputs, _.bind(function (input) {
        this.removeInput(input);
      }, this));
    },

    addError: function(message, messageId, SpeakInput) {
      var error = {
            id: messageId,
            text: message,
            input: SpeakInput
          },
        errors = this.get('errors'),
        errorExist = _.findWhere(errors, { id: messageId });

      if (errorExist) {
        errorExist.text = message;
      } else {
        errors.push(error);
      }

      this.set('errors', null, { silent: true });
      this.set('errors', errors);
      this.trigger('validation:input:error', error, SpeakInput);
    },

    removeError: function(messageId, SpeakInput) {
      var errors = _.filter(this.get('errors'), function(error) {
        return error.id.indexOf(messageId) === -1;
      });
      this.set('errors', errors);
      this.trigger('validation:input:success', { id: messageId }, SpeakInput);
    },

    destroy: function () {
      this.reset();
      this.set('inputs', []);
      this.off('validation:input:error');
      this.off('validation:input:success');
      this.off('change:valid');
    },

    reset: function() {
      this.set('errors', []);
    }
  });
})