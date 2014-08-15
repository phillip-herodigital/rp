(function ($) {
  $.widget("sc.EditableDropDown", {
    options: {
      allowEmpty : true,
      validationPattern: null,
      transformFunction: null,
      source: []
    },
    _create: function () {
      var self = this,
                select = $(self.element).hide(),
                input = select.clone().removeAttr('id').removeAttr('name')
                .insertAfter(select)
                .autocomplete({
                  delay: 0,
                  minLength: 0,
                  source: self.options.source,
                  select: function (event, ui) {
                    if (ui.item) {
                      input.val(ui.item.label);
                      input.blur();
                      if (input.autopostback)
                        __doPostBack(select.context.id, "");
                    }
                  }
                })
                .on('blur', function () {
                  self.sync(select, input);
                })
                .on('focus', function () {
                  input.autocomplete("search", "");
                });

      input.autopostback = self.options.autopostback;
      input.show();
    },
    sync: function (select, input) {
      var self = this;
      var enteredValue = input.val();
      var oldValue = select.val();

      if (self.options.allowEmpty && enteredValue == '') {
        select.val('');
        return;
      }

      // checking entered value to be valid
      var validationPattern = self.options.validationPattern;
      if (validationPattern && !validationPattern.test(enteredValue)) {
        input.val(oldValue);
        return;
      }

      var transformFunction = self.options.transformFunction;
      if (transformFunction) {
        enteredValue = transformFunction(enteredValue);

        // checking entered value to be valid after transformation
        if (validationPattern && !validationPattern.test(enteredValue)) {
          input.val(oldValue);
          return;
        }
      }
      
      // applying transformed value
      input.val(enteredValue);
      
      if (oldValue != enteredValue) {
        select.val(enteredValue);
      }
    },
    destroy: function () {
      this.input.remove();
      this.element.show();
      $.Widget.prototype.destroy.call(this);
    }
  });
})(jQuery);