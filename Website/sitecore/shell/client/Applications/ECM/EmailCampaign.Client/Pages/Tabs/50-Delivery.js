define(["sitecore", "/-/speak/v1/ecm/DispatchTab.js"], function (sitecore, dispatchTab) {
  var deliveryTab = sitecore.Definitions.App.extend({
    initialized: function () {
      var contextApp = this;
      sitecore.trigger("mainApp", this);

      this.setMessageId(contextApp);

      dispatchTab.init(contextApp);

      sitecore.on("change:messageContext", function () {
        contextApp.updateReadonly(contextApp);
        contextApp.updateLanguageName(contextApp);
      });

      sitecore.on("change:messageContext:nonReadonly", function () {
        contextApp.MessageContext.set("isReadonly", false);
        contextApp.updateReadonly(contextApp);
      });

      sitecore.trigger("change:messageContext");
    },

    updateReadonly: function (contextApp) {
      var isReadonly = contextApp.MessageContext.get("isReadonly");

      contextApp.ABVariantsSizeComboBox.set("isEnabled", !isReadonly);
      if (contextApp.ScheduleRecurringIntervalComboBox && contextApp.ScheduleRecurringRadioButton) {
        contextApp.ScheduleRecurringIntervalComboBox.set("isEnabled", !isReadonly && contextApp.ScheduleRecurringRadioButton.get("isChecked"));
      }

      contextApp.SendMessageNowRadioButton.set("isEnabled", !isReadonly);
      contextApp.ScheduleDeliveryRadioButton.set("isEnabled", !isReadonly);
      if (contextApp.ScheduleRecurringRadioButton) {
        contextApp.ScheduleRecurringRadioButton.set("isEnabled", !isReadonly);
      }

      contextApp.NotificationEnableCheckBox.set("isEnabled", !isReadonly);
      contextApp.EmulationModeCheckBox.set("isEnabled", !isReadonly);
      contextApp.SendButton.set("isEnabled", !isReadonly);
      contextApp.ScheduleButton.set("isEnabled", !isReadonly);
      contextApp.StartTestButton.set("isEnabled", !isReadonly);
      contextApp.ScheduleTestButton.set("isEnabled", !isReadonly);

      contextApp.AutomaticTimeTextBox.set("isEnabled", !isReadonly);
      contextApp.AutomaticIntervalComboBox.set("isEnabled", !isReadonly);
      contextApp.AutomationBestValueRadioButton.set("isEnabled", !isReadonly);
      contextApp.AutomationOptionHighestRateRadioButton.set("isEnabled", !isReadonly);
    },

    setMessageId: function (contextApp) {
      var messageId = contextApp.MessageContext.get("messageId");
      contextApp.DispatchContext.set("messageId", messageId);
      contextApp.VariantDataSource.set("messageId", messageId);
    },

    updateLanguageName: function (contextApp) {
      var languageName = contextApp.MessageContext.get("languageName");
      contextApp.UsePreferredLanguageHintTextContextLanguage.set("text", languageName);
    }
  });

  return deliveryTab;
});
