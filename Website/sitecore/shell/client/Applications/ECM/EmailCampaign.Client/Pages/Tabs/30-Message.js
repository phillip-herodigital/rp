define(["sitecore", "/-/speak/v1/ecm/MessageTab.js"], function (sitecore) {
  var messageTab = sitecore.Definitions.App.extend({
    initialized: function () {
      var contextApp = this;
      sitecore.trigger("mainApp", this);
      initMessageTab(sitecore, contextApp);

      sitecore.on("change:messageContext", function() {
        var hasAttachments = contextApp.MessageContext.get("hasAttachments");

        contextApp.AttachmentsListControl.set("items", contextApp.MessageContext.get("attachments"));
        contextApp.AttachmentsDropDownButton.set("isVisible", hasAttachments);
        contextApp.MessageContext.trigger("change:attachments");

        if (contextApp.RecipientPreviewDataSource) {
          contextApp.RecipientPreviewDataSource.set("messageId", contextApp.MessageContext.get("messageId"));
          contextApp.refreshRecipients(contextApp);
        }
      });

      contextApp.on("action:addattachment", function() {
        sitecore.trigger("action:addattachment");
      }, contextApp);

      this.subscribeToSearchEvents(contextApp);

      sitecore.trigger("change:messageContext");
    },

    refreshRecipients: function () {
      this.RecipientPreviewDataSource.refreshRecipients([""]);
    },

    subscribeToSearchEvents: function(contextApp) {
      contextApp.on("action:message:recipients:search", this.searchRecipients, contextApp);
    },

    searchRecipients: function () {
      this.RecipientPreviewDataSource.set("search", this.RecipientPreviewSearchButtonTextBox.get("text"));
      this.refreshRecipients();
    },
  });

  return messageTab;
});
