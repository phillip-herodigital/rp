define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      postServerRequest("ecm.savemessage.save", { message: context.currentContext.message, language: context.currentContext.language }, function (response) {
        context.currentContext.messageBar.removeMessage(function (error) { return error.id === "error.ecm.savemessage.save"; });
        if (response.error) {
          var messagetoAddError = { id: "error.ecm.savemessage.save", text: response.errorMessage, actions: [], closable: true };
          context.currentContext.messageBar.addMessage("error", messagetoAddError);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }
        context.currentContext.saved = true;
      }, false);
    }
  };
});