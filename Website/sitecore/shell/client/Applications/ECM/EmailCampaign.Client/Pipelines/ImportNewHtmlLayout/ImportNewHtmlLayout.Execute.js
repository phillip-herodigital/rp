define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 2,
    execute: function (context) {
      postServerRequest("EXM/ImportHtml", { fileItemId: context.currentContext.fileItemId, fileName: context.currentContext.fileName, database: context.currentContext.database }, function (response) {
        if (response.error) {
          context.currentContext.messageBar.removeMessage(function (error) { return error.text === response.errorMessage; });
          context.currentContext.messageBar.addMessage("error", response.errorMessage);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }

        context.currentContext.messageBar.removeMessage(function (error) { return error.id === "importHtmlLayoutFailed"; });
        if (!response.value) {
          var messagetoAdd = { id: "importHtmlLayoutFailed", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.ImportHtmlLayout.ImportFailed"), actions: [], closable: false };
          context.currentContext.messageBar.addMessage("error", messagetoAdd);
          context.aborted = true;
          context.currentContext.errorCount = 1;
          return;
        } else {
          context.currentContext.layoutId = response.value;
        }
      }, false);
    }
  };
});