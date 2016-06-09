define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore, ServerRequest) {
  return {
    priority: 1,
    execute: function (context) {
      ServerRequest("EXM/" + context.currentContext.actionName, {
        data: context.currentContext.request,
        success: function (response) {
          context.currentContext.messageBar.removeMessage(function (error) { return error.id === "error.ecm.dispatchmessage." + context.currentContext.actionName; });
          if (response.error) {
            if (response.errorMessage) {
              var messagetoAddError = { id: "error.ecm.dispatchmessage." + context.currentContext.actionName, text: response.errorMessage, actions: [], closable: true };
              context.currentContext.messageBar.addMessage("error", messagetoAddError);
            }

            if (response.errorMessages) {
              response.errorMessages.forEach(function (message) {
                var actionError = { id: "error.ecm.dispatchmessage." + context.currentContext.actionName, text: message.message, actions: [{ text: message.actionText, action: message.actionLink }], closable: true };
                context.currentContext.messageBar.addMessage("error", actionError);
              });
            }

            context.currentContext.errorCount = 1;
            context.aborted = true;
            sitecore.trigger("dispatch:pipeline:error");
            return;
          } else {
            if (response.notificationMessages) {
              response.notificationMessages.forEach(function (message) {
                var notificationMessage = { id: "notification.ecm.dispatchmessage." + context.currentContext.actionName, text: message.message, actions: [{ text: message.actionText, action: message.actionLink }], closable: true };
                context.currentContext.messageBar.addMessage("notification", notificationMessage);
              });
            }

            context.app.MessageContext.viewModel.refresh();
            context.app.DispatchContext.viewModel.refresh();

            sitecore.trigger("dispatch:pipeline:success:" + context.currentContext.actionName);
          }
        }
      });

    }
  };
});