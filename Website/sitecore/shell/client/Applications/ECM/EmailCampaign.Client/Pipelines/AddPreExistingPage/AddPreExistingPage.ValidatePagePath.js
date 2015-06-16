define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      postServerRequest("ecm.addpreExistingPage.validatePagePath", { databaseName: context.currentContext.databaseName, existingMessagePath: context.currentContext.existingMessagePath }, function (response) {
        context.currentContext.messageBar.removeMessage(function (error) { return error === response.errorMessage; });
        if (response.error) {
          context.currentContext.messageBar.addMessage("error", response.errorMessage);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        }
      }, false);
    }
  };
});