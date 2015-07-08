define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 2,
    execute: function (context) {
      postServerRequest("ecm.createnewmessage.create", { messageTemplateId: context.currentContext.messageTemplateId, managerRootId: context.currentContext.managerRootId, messageName: context.currentContext.messageName, language: context.currentContext.language, messageTypeTemplateId: context.currentContext.messageTypeTemplateId, LayoutId: context.currentContext.layoutId }, function (response) {
        if (response.error) {
          context.currentContext.messageBar.addMessage("error", response.errorMessage);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }

        context.currentContext.messageBar.removeMessage(function (error) { return error.id === "createFailedMessage"; });
        if (!response.value) {
          var messagetoAdd = { id: "createMessageFailed", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.CreateFailed"), actions: [], closable: false };
          context.currentContext.messageBar.addMessage("error", messagetoAdd);
          context.aborted = true;
          context.currentContext.errorCount = 1;
          return;
        } else {
          context.currentContext.newMessageId = response.value;
        }
      }, false);
    }
  };
});