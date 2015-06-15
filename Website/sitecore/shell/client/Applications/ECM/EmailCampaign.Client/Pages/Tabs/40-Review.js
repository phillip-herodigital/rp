define(["sitecore", "/-/speak/v1/ecm/ReviewTab.js"], function (sitecore, review) {
  var reviewTab = sitecore.Definitions.App.extend({
    initialized: function () {
      var contextApp = this;
      sitecore.trigger("mainApp", this);

      initReviewTab(sitecore, contextApp, contextApp.MessageContext, contextApp.MessageBar);

      sitecore.on("change:messageContext", function () {
        contextApp.updateReadonly(contextApp);

        var messageId = contextApp.MessageContext.get("messageId");
        var language = contextApp.MessageContext.get("language");

        contextApp.SendQuickTestEmailTextBox.set("text", contextApp.MessageContext.get("lastTestEmail"));

        contextApp.EmailPreviewReportDataSource.set("language", language);
        contextApp.EmailPreviewReportDataSource.set("messageId", messageId);

        contextApp.SpamCheckReportDataSource.set("language", language);
        contextApp.SpamCheckReportDataSource.set("messageId", messageId);
      });

      sitecore.trigger("change:messageContext");
    },

    updateReadonly: function (contextApp) {
      var isReadonly = contextApp.MessageContext.get("isReadonly");
      contextApp.SendQuickTestEmailTextBox.set("isReadonly", isReadonly);
      contextApp.SendQuickTestEmailTextBox.set("isEnabled", !isReadonly);
    }
  });

  return reviewTab;
});
