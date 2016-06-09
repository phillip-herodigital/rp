define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore, ServerRequest) {
  return {
    priority: 1,
    execute: function (context) {
      var requestName = "EXM/AddLanguage";
      
      ServerRequest(requestName, {
        data: { messageId: context.currentContext.messageId, language: context.currentContext.language, newLanguage: context.currentContext.newLanguage },
        success: function (response) {
          if (response.error) {
            context.aborted = true;
            return;
          }
          if (response.notificationMessages) {
            response.notificationMessages.forEach(function (message) {
              context.currentContext.messageBar.removeMessage(function (notification) { return notification.id === "notification." + requestName + message.message; });

              var notificationMessage = { id: "notification." + requestName + message.message, text: message.message, actions: [{ text: message.actionText, action: message.actionLink }], closable: true };
              context.currentContext.messageBar.addMessage("notification", notificationMessage);
            });
          }

          var messagetoAdd = { text: response.errorMessage, actions: [], closable: true };
          context.currentContext.messageBar.addMessage("notification", messagetoAdd);
          _.each(response.variantMessages, function (variantMessage) {
            messagetoAdd = { text: variantMessage, actions: [], closable: true };
            context.currentContext.messageBar.addMessage("notification", messagetoAdd);
          });
          context.currentContext.languageAdded = true;
        },
        async: false
      });

    }
  };
});