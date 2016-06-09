define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore, ServerRequest) {
return {
    priority: 1,
    execute: function (context) {
      var requestName = "EXM/CopyAttachmentFromLanguage";
      ServerRequest(requestName, {
        data: {
          messageId: context.currentContext.messageId,
          fromLanguage: context.currentContext.fromLanguage,
          toLanguage: context.currentContext.toLanguage
        },
        success: function (response) {
          if (response.error) {
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
        },
        async: false
      });

    }
  };
});