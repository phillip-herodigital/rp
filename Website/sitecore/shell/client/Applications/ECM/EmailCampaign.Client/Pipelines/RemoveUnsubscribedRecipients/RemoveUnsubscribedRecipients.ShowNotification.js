define(["sitecore"], function (sitecore) {
  return {
    execute: function (context) {
      var type = "notification";
      
      for (var key in context.response) {
        var text = null;
        var recipientList = $.grep(context.recipientLists, function (e) { return e.itemId == key; });
        if (!recipientList) {
          break;
        }

        switch (context.response[key]) {
          case "ok":
            text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.RemoveUnsubscribedJobStarted")
              .split("{0}").join(recipientList[0].name);
            break;
          case "remove-unsubscribed-recipients-job-already-active":
            text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.RemoveUnsubscribedJobAlreadyRunning")
              .split("{0}").join(recipientList[0].name);
            break;
          case "other-job-already-active":
            text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.OtherJobAlreadyRunning")
              .split("{0}").join(recipientList[0].name);
            type = "warning";
            break;
          case "referenced-by-message-in-progress":
            text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.UsedByMessageInProgress")
              .split("{0}").join(recipientList[0].name);
            type = "warning";
            break;
        }
        if (text) {
          var message = { id: "EXM/RemoveUnsubscribedContacts", text: text, actions: [], closable: true };
          context.messageBar.addMessage(type, message);
        }
      }


    }
  };
});