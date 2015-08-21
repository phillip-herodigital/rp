define(["sitecore"], function(sitecore) {
  return {
    execute: function(context) {
      if (!context.confirmed) {
        context.aborted = true;
        return;
      }

      var itemIds = [];
      for (var i = 0; i < context.recipientLists.length; i++) {
        itemIds[i] = context.recipientLists[i].itemId;
      }
      postServerRequest("EXM/RemoveUnsubscribedContacts", { recipientListIds: itemIds, messageId: context.messageId }, function (response) {
        if (response.error) {
          sitecore.trigger("alertdialog", response.errorMessage);
          context.aborted = true;
          return;
        }

        context.response = response.results;
      }, false);
    }
  };
});