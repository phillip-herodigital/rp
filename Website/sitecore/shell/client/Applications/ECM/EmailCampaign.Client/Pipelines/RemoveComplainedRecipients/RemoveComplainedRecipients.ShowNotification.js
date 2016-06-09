define(["sitecore"], function (sitecore) {
return {
    priority: 30,

    execute: function (context) {
      var type = "notification";
      var text = null;

      switch(context.response) {
        case "ok":
          text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.RemoveComplainedJobStarted");
          break;
        case "remove-complained-recipients-job-already-active":
          text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.RemoveComplainedJobAlreadyRunning")
            .split("{0}").join(context.recipientList.name);
          break;
        case "other-job-already-active":
          text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.OtherJobAlreadyRunning")
            .split("{0}").join(context.recipientList.name);
          type = "warning";
          break;
        case "referenced-by-message-in-progress":
          text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.UsedByMessageInProgress")
            .split("{0}").join(context.recipientList.name);
          type = "warning";
          break;
      }

      if (text) {
        var message = { id: "EXM/RemoveComplainedContacts", text: text, actions: [], closable: true, temporary: true };
        context.messageBar.addMessage(type, message);
      }
    }
  };
});