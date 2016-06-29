define(["sitecore"], function (sitecore) {
  return {
    priority: 2,
    execute: function (context) {
      context.currentContext.messageBar.removeMessage(function (error) { return error.id === "error.ecm.savemessage.norecipientlist"; });
      if (context.currentContext.includedRecipientDataSource) {
        var onChangeIsBusy = function () {
          if (!context.currentContext.includedRecipientDataSource.get("isBusy")) {
            if (!context.currentContext.includedRecipientDataSource.get("hasRecipientLists")) {
              var messagetoAdd = { id: "error.ecm.savemessage.norecipientlist", text: sitecore.Resources.Dictionary.translate("ECM.Recipients.NoRecipientListAdded"), actions: [], closable: true };
              context.currentContext.messageBar.addMessage("error", messagetoAdd);
            }
          }
        }
        context.currentContext.includedRecipientDataSource.off("change:isBusy", onChangeIsBusy);
        context.currentContext.includedRecipientDataSource.on("change:isBusy", onChangeIsBusy);
      }
    }
  };
});