define(["sitecore", "/-/speak/v1/ecm/RecipientsTab.js"], function (sitecore, recipientsTab) {
  var recipientTab = sitecore.Definitions.App.extend({
    initialized: function () {
      var contextApp = this;
      sitecore.trigger("mainApp", this);

      sitecore.on("change:messageContext", function () {
        var messageId = contextApp.MessageContext.get("messageId");
        contextApp.IncludedRecipientDataSource.set("messageId", messageId);

        contextApp.MessageContext.set("includedRecipients", contextApp.IncludedRecipientListControl.get("items"));

        if (contextApp.ExcludedRecipientDataSource) {
          contextApp.ExcludedRecipientDataSource.set("messageId", messageId);
        }

        contextApp.MessageContext.set("isBusy", false);
      });
      
      contextApp.IncludedRecipientListControl.on("change:items", function () {
        contextApp.MessageContext.set("includedRecipients", contextApp.IncludedRecipientListControl.get("items"));
      });

      sitecore.trigger("change:messageContext");
      
      recipientsTab.init(contextApp);
      
      contextApp.MessageContext.trigger("change:isBusy", this);
    }
  });

  return recipientTab;
});
