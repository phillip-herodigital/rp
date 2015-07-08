define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (_sc) {
  return {
    priority: 3,
    execute: function (context) {
      context.currentContext.messageBar.removeMessage(function (error) { return error.id === "error.ecm.sendquicktest.execute"; });
      postServerRequest("ecm.sendquicktest.execute", {
        messageId: context.currentContext.messageId,
        language: context.currentContext.language,
        variantIds: context.currentContext.variantIds,
        testEmails: context.currentContext.testEmails
      }, function (response) {
        if (response.error) {
          var messagetoAdd = { id: "error.ecm.sendquicktest.execute", text: response.errorMessage, actions: [], closable: true };
          context.currentContext.messageBar.addMessage("error", messagetoAdd);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }

        context.currentContext.messageBar.addMessage("notification", { text: response.value, actions: [], closable: true });
        context.response = response;
      }, false);
    }
  };
});