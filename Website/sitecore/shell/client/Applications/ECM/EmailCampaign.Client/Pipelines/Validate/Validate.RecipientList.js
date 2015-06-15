define(["sitecore", "/-/speak/v1/ecm/Validation.js"], function (sitecore) {
  return {
    priority: 6,
    execute: function (context) {
      context.currentContext.messageBar.removeMessage(function (error) { return error.id === "error.ecm.savemessage.norecipientlist"; });
      if (context.currentContext.includedRecipientDataSource) {
        context.currentContext.includedRecipientDataSource.on("change:isBusy", function () {
          if (!context.currentContext.includedRecipientDataSource.get("isBusy")) {
            if (!context.currentContext.includedRecipientDataSource.get("hasRecipientLists")) {
              var messagetoAdd = { id: "error.ecm.savemessage.norecipientlist", text: sitecore.Resources.Dictionary.translate("ECM.Recipients.NoRecipientListAdded"), actions: [], closable: true };
              context.currentContext.messageBar.addMessage("error", messagetoAdd);
            }
          }
        });
      }
    }
  };
});