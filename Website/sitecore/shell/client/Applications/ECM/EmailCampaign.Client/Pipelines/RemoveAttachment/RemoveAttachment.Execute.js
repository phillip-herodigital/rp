define(["sitecore", "/-/speak/v1/ecm/String.js"], function (sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      postServerRequest("ecm.removeattachment.remove", { messageId: context.currentContext.messageId, attachmentIds: context.currentContext.attachmentIds, language: context.currentContext.language }, function (response) {
        context.currentContext.messageBar.removeMessage(function (error) { return error.id === "error.ecm.removeattachment.remove"; });
        if (response.error) {
          var messagetoAddError = { id: "error.ecm.removeattachment.remove", text: response.errorMessage, actions: [], closable: true };
          context.currentContext.messageBar.addMessage("error", messagetoAddError);
          context.aborted = true;
          return;
        }
      }, false);
    }
  };
});