define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
return {
    priority: 2,
    execute: function (context) {
        postServerRequest("EXM/CanCreateNewMessage", { managerRootId: context.currentContext.managerRootId }, function (response) {
        context.currentContext.messageBar.removeMessage(function (error) { return error === response.errorMessage; });
        if (response.error) {
          context.currentContext.messageBar.addMessage("error", response.errorMessage);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }

        context.currentContext.messageBar.removeMessage(function (error) { return error.id === "canNotCreateMessage"; });
        if (!response.value) {
          var messagetoAdd = { id: "canNotCreateNewMessage", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.CanNotCreate"), actions: [], closable: false };
          context.currentContext.messageBar.addMessage("error", messagetoAdd);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }

      }, false);
    }
  };
});