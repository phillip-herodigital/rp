define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function(sitecore) {
return {
    priority: 4,
    execute: function(context) {
      postServerRequest("ecm.addpreExistingPage.add", { databaseName: context.currentContext.databaseName, newMessageId: context.currentContext.newMessageId, existingMessagePath: context.currentContext.existingMessagePath }, function(response) {
        if (response.error) {
          context.currentContext.messageBar.addMessage("error", response.errorMessage);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }

        context.currentContext.messageBar.removeMessage(function(error) { return error.id === "addPreExistingPageFailed"; });
        if (!response.value) {
          var messagetoAdd = { id: "addPreExistingPageFailed", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.AddExistingPage.AddFailed"), actions: [], closable: false };
          context.currentContext.messageBar.addMessage("error", messagetoAdd);
          context.aborted = true;
          context.currentContext.errorCount = 1;
          return;
        }
      }, false);
    }
  };
});