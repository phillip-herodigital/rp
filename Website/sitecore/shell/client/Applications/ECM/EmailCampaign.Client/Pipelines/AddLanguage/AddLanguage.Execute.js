define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/String.js"], function (sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      var requestName = "ecm.addlanguage.add";
      postServerRequest(requestName, { messageId: context.currentContext.messageId, language: context.currentContext.language, newLanguage: context.currentContext.newLanguage },
        function (response) {
          context.currentContext.messageBar.removeMessage(function (error) { return error.id === "error." + requestName; });
          if (response.error) {
            var messagetoAddError = { id: "error." + requestName, text: response.errorMessage, actions: [], closable: true };
            context.currentContext.messageBar.addMessage("error", messagetoAddError);
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
        }, false);
    }
  };
});