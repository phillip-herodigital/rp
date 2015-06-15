define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/String.js"], function (sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      var currentContext = context.app.currentContext;
      currentContext.errorPopupResult = 0;
      var reqestName = "ecm.saveassubscriptiontemplate.execute";
      var errorMessageId = "error." + reqestName;
      postServerRequest(reqestName, { sourceMessageId: currentContext.messageId, messageName: currentContext.messageName.escapeAmpersand() }, function (response) {
        currentContext.messageBarMain.removeMessage(function (error) { return error.id === errorMessageId; });
        currentContext.messageBar.removeMessage(function (error) { return error.id === errorMessageId; });
        if (response.errorMessage.length > 0) {
          var messagetoAdd = { id: errorMessageId, text: response.errorMessage, actions: [], closable: true };
          if (response.error) {
            if (response.value == "popup") {
              currentContext.messageBar.addMessage("error", messagetoAdd);
              currentContext.errorPopupResult = 1;
            } else {
              currentContext.messageBarMain.addMessage("error", messagetoAdd);
            }
            context.app.aborted = true;
            return;
          } else {
            context.app.aborted = false;
            currentContext.messageBarMain.addMessage("notification", messagetoAdd);
          }
        }
      }, false);
    }
  };
});