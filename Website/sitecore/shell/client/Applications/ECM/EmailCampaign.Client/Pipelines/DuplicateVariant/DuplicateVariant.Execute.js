define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 1,
    execute: function (context, callback) {
        postServerRequest("EXM/DuplicateMessageVariant", { messageId: context.currentContext.messageId, variantId: context.currentContext.variantId, language: context.currentContext.language }, function (response) {
        context.currentContext.messageBar.removeMessage(function (error) { return error.id === "error.ecm.messagevariant.duplicate"; });
        if (response.error) {
          var messagetoAdd = { id: "error.ecm.messagevariant.duplicate", text: response.errorMessage, actions: [], closable: false };
          context.currentContext.messageBar.addMessage("error", messagetoAdd);
          context.currentContext.errorCount = 1;
          context.aborted = true;
        } else {
          context.currentContext.newVariant = response.newVariant;
          callback(response.newVariant);
        }
        context.app.MessageContext.set("isBusy", false);
      }, false);
    }
  };
});