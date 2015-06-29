define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
return {
    priority: 3,
    execute: function (context) {

      postServerRequest("ecm.createnewmessage.getmessageurl", { value: context.currentContext.newMessageId }, function (response) {
        if (response.error) {
          context.currentContext.messageBar.addMessage("error", response.errorMessage);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }

        context.currentContext.messageBar.removeMessage(function (error) { return error.id === "canNotOpenNewMessage"; });
        if (!response.value) {
          var messagetoAdd = { id: "canNotOpenNewMessage", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.CanNotOpenNewMessage"), actions: [], closable: false };
          context.currentContext.messageBar.addMessage("error", messagetoAdd);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }
        window.parent.location.replace(response.value);
      }, false);
    }
  };
});