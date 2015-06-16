define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
return {
    priority: 1,
    execute: function (context) {
      postServerRequest("ecm.importnewdesign.import", { importFolderId: context.currentContext.importFolderId, managerRootId: context.currentContext.managerRootId, messageTypeTemplateId: context.currentContext.messageTypeTemplateId }, function (response) {
        if (response.error) {
          context.currentContext.messageBar.addMessage("error", response.errorMessage);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }

        context.currentContext.itemPath = response.itemPath;
        context.currentContext.messageTemplateId = response.messageTemplateId;
        if (response.errorMessage) {
          context.currentContext.messageBar.addMessage("error", response.errorMessage);
        }
        //context.currentContext.messageBar.removeMessage(function (error) { return error.id === "importDesignFailed"; });
        //if (!response.value) {
        //  var messagetoAdd = { id: "importDesignFailed", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.ImportNewDesign.ImportFailed"), actions: [], closable: false };
        //  context.currentContext.messageBar.addMessage("error", messagetoAdd);
        //  context.aborted = true;
        //  context.currentContext.errorCount = 1;
        //  return;
        //}
      }, false);
    }
  };
});