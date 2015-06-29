define(["sitecore"], function (sitecore) {
  return {
    recipientListLocked: function (messageBar) {
      if (!messageBar) {
        return;
      }

      var notificationId = "notification.recipientListLocked";
      messageBar.removeMessage(function(notificationToRemove) {
        return notificationToRemove.id === notificationId;
      });

      var notificationMessage = sitecore.Resources.Dictionary.translate("ECM.Recipients.RecipientListLockedNotification");
      var notification = { id: notificationId, text: notificationMessage, actions: [], closable: true };
      messageBar.addMessage("notification", notification);
    }
  };
})