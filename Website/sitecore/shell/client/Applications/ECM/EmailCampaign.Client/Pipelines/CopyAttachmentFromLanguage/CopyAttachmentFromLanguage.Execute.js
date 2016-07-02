define(["sitecore", "/-/speak/v1/ecm/String.js"], function (sitecore) {
return {
    priority: 1,
    execute: function (context) {
      var requestName = "EXM/CopyAttachmentFromLanguage";
      postServerRequest(requestName, {
        messageId: context.currentContext.messageId,
        fromLanguage: context.currentContext.fromLanguage,
        toLanguage: context.currentContext.toLanguage
      },
      function (response) {
        context.currentContext.messageBar.removeMessage(function (error) { return error.id === "error." + requestName; });
        if (response.error) {
          var messagetoAddError = { id: "error." + requestName, text: response.errorMessage, actions: [], closable: true };
          context.currentContext.messageBar.addMessage("error", messagetoAddError);
          context.currentContext.errorCount = 1;
          context.aborted = true;
          return;
        } else {
          if (response.notificationMessages) {
            response.notificationMessages.forEach(function (message) {
              context.currentContext.messageBar.removeMessage(function (notification) { return notification.id === "notification." + requestName + message.message; });

              var notificationMessage = { id: "notification." + requestName + message.message, text: message.message, actions: [{ text: message.actionText, action: message.actionLink }], closable: true };
              context.currentContext.messageBar.addMessage("notification", notificationMessage);
            });
          }

          if (response.errorMessage) {
            var messagetoAddNotification = { id: "notification." + requestName, text: response.errorMessage, actions: [], closable: true };
            context.currentContext.messageBar.addMessage("notification", messagetoAddNotification);
          }
          sitecore.trigger("attachment:file:added");
        }
      }, false);
    }
  };
});