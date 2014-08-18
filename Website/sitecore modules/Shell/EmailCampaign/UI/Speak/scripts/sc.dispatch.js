(function ($) {
  $.widget('sc.dispatch', {
    options: {
      messageId: '',
      messageState: '',
      finalMessageState: '',
      deliveryMode: '',
      scheduleDeliveryMode: '',
      isVariantSelectionEnabled: '',
      isAbTestingVisible: '',
      dispatchVariantsListId: '',
      deliveryModeId: '',
      schedulerOptionsId: '',
      enableNotificationsId: '',
      emailAddressessId: '',
      actionButtonId: '',
      startText: '',
      scheduleText: '',
      pauseText: '',
      resumeText: ''
    },

    _create: function () {
      // TODO: CSS hack to remove ambigous span in accordion header
      $(".p-title span[id*=AccordionHeaderLabel]").next().hide();

      options = this.options;

      this.addEvents();
      this.fixControlDisabling();
    },

    _notificationsClick: function () {
      var self = this,
          enableNotifications = self.element.find('#' + self.options.enableNotificationsId);

      enableNotifications.click(function () {
        self.element.find('#' + self.options.emailAddressessId).attr('disabled', enableNotifications.attr('checked') != 'checked');
      });
    },

    _changeSchedulerState: function (self, state, text) {
      self.element.find('#' + self.options.schedulerOptionsId).prop('disabled', state);
      self.element.find('#' + self.options.schedulerOptionsId + ' input').prop('disabled', state);
      self.element.find('#' + self.options.schedulerOptionsId + ' select').prop('disabled', state);

      self.element.find('#' + self.options.actionButtonId).attr('value', text);
    },

    addEvents: function () {
      var self = this;
      self.element.find('#' + options.deliveryModeId + ' :radio').click(function () {
        if (this.value == self.options.scheduleDeliveryMode) {
          self._changeSchedulerState(self, false, self.options.scheduleText);
        } else {
          self._changeSchedulerState(self, true, self.options.startText);
        }

        options.deliveryMode = this.value;
      });

      self._notificationsClick();

      self.element.find('#' + options.actionButtonId).live('click', function () {
        var btn = $("input[id$='SaveButton']").first(),
            name = btn.attr('name'),
            value = btn.attr('value'),
            d = {};

        d[name] = value;
        $.netajax(self.element, 'send', true);
        $(this).attr('disabled', 'true');
      });
    },

    fixControlDisabling: function () {
      var self = this;

      if (!options.isVariantSelectionEnabled) {
        self.element.find('#' + options.dispatchVariantsListId + ' div.abn-button').attr('onclick', '');
      }
    },

    destroy: function () {
      return $.Widget.prototype.destroy.call(this);
    }
  });
})(jQuery);


(function ($) {
    var prototype = $.sc.validate.prototype;

    $.widget("sc.validate", $.extend({}, prototype, {
         _bind: function() {
            var self = this;
            prototype._bind.apply(this, arguments);
            $("body").on("displayvalidation", function (e) {
              $.each(self.highlighted(), function () {
                this.hidden = true;
                $(this.element).trigger('validatehighlight', this);
              });
          }); 
      } 
    }));

})(jQuery);

/*390360*/
function SelectableValueFromDdl(ddlId, hfId) {
    var ddl = $('#' + ddlId);
    var hf = $('#' + hfId);

    function init() {
        setSelectedValueFromDdl();
        ddl.change(function () {
            setSelectedValueFromDdl();
        });
    }

    function setSelectedValueFromDdl() {
        var ttt = ddl.find('option:selected').val();
        hf.val(ttt);
    }

    init();
}