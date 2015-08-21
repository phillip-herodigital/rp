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
            text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.RemoveUnsubscribedJobStarted").replaceAll("{0}", recipientList[0].name);
            break;
          case "remove-unsubscribed-recipients-job-already-active":
            text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.RemoveUnsubscribedJobAlreadyRunning").replaceAll("{0}", recipientList[0].name);
            break;
          case "other-job-already-active":
            text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.OtherJobAlreadyRunning").replaceAll("{0}", recipientList[0].name);
            type = "warning";
            break;
          case "referenced-by-message-in-progress":
            text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.UsedByMessageInProgress").replaceAll("{0}", recipientList[0].name);
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