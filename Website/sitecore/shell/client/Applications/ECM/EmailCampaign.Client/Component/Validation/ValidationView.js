define(['sitecore', 'backbone'], function (sitecore, backbone) {
  return backbone.View.extend({
    initialize: function () {
      var inputs = this.model.get('inputs');
      if (inputs && inputs.length) {
        this.bindInputs(inputs);
      }
      if (this.model.get('highlightInput')) {
        this.bindInputHighlight();
      }
      this.attachEvents();
    },

    attachEvents: function () {
      this.model.on('change:inputs', this.onChangeInputs, this);
    },

    onChangeInputs: function () {
      var oldInputs = this.model.previousInputs,
        newInputs = this.model.get('inputs');
      var inputsToBind = _.filter(newInputs, function (newInput) {
        return !_.findWhere(oldInputs, { input: newInput.input });
      });
      this.bindInputs(inputsToBind);
      var inputsToUnbind = _.filter(oldInputs, function (oldInput) {
        return !_.findWhere(newInputs, { input: oldInput.input });
      });
      this.unbindInputs(inputsToUnbind);
    },

    attachInputEvents: function (input, inputData) {
      input.on(inputData.validateEvent || this.model.get('inputValidateEvent'), _.bind(this.onInputChange, this, inputData), this);
    },

    onInputChange: function (inputData) {
      var inputValue = this.model.getInputAttr(inputData.input, inputData.valueProp || 'text', inputData.trim);

      if (!this.model.isOptionalOrSkipped(inputData, inputValue)) {
        this.model.validate(inputValue, inputData.validators, inputData.input);
      }
    },

    bindInput: function (inputData) {
      if ($.type(inputData.input) === 'array') {
        _.each(inputData.input, _.bind(function (input) {
          this.attachInputEvents(input, inputData);
        }, this));
      } else {
        this.attachInputEvents(inputData.input, inputData);
      }
    },

    bindInputs: function (inputsData) {
      _.each(inputsData, _.bind(function (inputData) {
        this.bindInput(inputData);
      }, this));
    },

    unbindInput: function (inputData) {
      var inputs = $.type(inputData.input) === 'array' ? inputData.input : [inputData.input];
      _.each(inputs, _.bind(function (input) {
        // workaround to unbind method witch was bound to context with using _.bind
        input.off(inputData.validateEvent || this.model.get('inputValidateEvent'), null, this);
      }, this));
    },

    unbindInputs: function (inputsData) {
      _.each(inputsData, _.bind(function (inputData) {
        this.unbindInput(inputData);
      }, this));
    },

    bindInputHighlight: function () {
      this.model.on({
        'validation:input:error': function (message, input) {
          if (input) {
            _.each($.type(input) !== 'array' ? [input] : input, _.bind(function (singleInput) {
              singleInput.viewModel.$el.parent().addClass(this.model.get('highlightClass'));
            }, this));
          }
        },
        'validation:input:success': function (message, input) {
          if (input) {
            _.each($.type(input) !== 'array' ? [input] : input, _.bind(function (singleInput) {
              singleInput.viewModel.$el.parent().removeClass(this.model.get('highlightClass'));
            }, this));
          }
        }
      }, this);
    }
  });
})