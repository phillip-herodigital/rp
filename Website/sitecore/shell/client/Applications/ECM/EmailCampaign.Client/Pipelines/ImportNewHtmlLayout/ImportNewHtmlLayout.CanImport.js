define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      postServerRequest("ecm.importnewhtmllayout.canimport", { messageTemplateId: context.currentContext.messageTemplateId, managerRootId: context.currentContext.managerRootId, messageName: context.currentContext.messageName }, function (response) {
        if (response.error) {
          context.currentContext.messageBar.addMessage("error", response.errorMessage);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }

        context.currentContext.messageBar.removeMessage(function (error) { return error.id === "canNotImportNewHtmlLayout"; });
        if (!response.value) {
          var messagetoAdd = { id: "canNotImportNewHtmlLayout", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.ImportHtmlLayout.CanNotImport"), actions: [], closable: false };
          context.currentContext.messageBar.addMessage("error", messagetoAdd);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }

      }, false);
    }
  };
});