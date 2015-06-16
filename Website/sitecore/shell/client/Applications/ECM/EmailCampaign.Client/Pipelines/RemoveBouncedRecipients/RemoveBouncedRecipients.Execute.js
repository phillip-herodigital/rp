define(["sitecore"], function (sitecore) {
  return {
    priority: 20,

    execute: function (context) {
      if (!context.confirmed) {
        context.aborted = true;
        return;
      }
      
      postServerRequest("ecm.recipientlist.removebouncedrecipients", { recipientListId: context.recipientList.itemId, messageId: context.messageId }, function (response) {
        if (response.error) {
          sitecore.trigger("alertdialog", response.errorMessage);
          context.aborted = true;
          return;
        }

        context.response = response.value;
      }, false);
    }
  };
});