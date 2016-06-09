define(["sitecore", "/-/speak/v1/ecm/ReviewTab.js"], function (sitecore, Review) {
  var reviewTab = sitecore.Definitions.App.extend({
    initialized: function () {
      var contextApp = this;
      sitecore.trigger("mainApp", this);
      this.SendQuickTestEmailTextBox.set("text", this.MessageContext.get("lastTestEmail") || "");

      Review.initReviewTab(contextApp, contextApp.MessageContext, contextApp.MessageBar);

      sitecore.on("change:messageContext", function () {
        contextApp.updateReadonly(contextApp);

        var messageId = contextApp.MessageContext.get("messageId");
        var language = contextApp.MessageContext.get("language");

        var lastEmail = contextApp.MessageContext.get("lastTestEmail");
        var prevLastEmail = contextApp.MessageContext.previous("lastTestEmail");

        if (lastEmail !== prevLastEmail) {
            contextApp.SendQuickTestEmailTextBox.set("text", contextApp.MessageContext.get("lastTestEmail") || "");
        }

        contextApp.EmailPreviewReportDataSource.set("language", language);
        contextApp.EmailPreviewReportDataSource.set("messageId", messageId);

        contextApp.SpamCheckReportDataSource.set("language", language);
        contextApp.SpamCheckReportDataSource.set("messageId", messageId);

        /*
         * Fix for LoadOnDemendPanel with subtabs
         *  even when LoadOnDemendPanel is loaded the subtabs still not render it's content and TabControl have no "rendered" event
         *  that is why used setTimeout 0 to "pause" the JavaScript execution to let the rendering threads catch up
         */
        setTimeout(function () {
          contextApp.SendQuickTestEmailTextBox.viewModel.focus();
        }, 0);
        
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
