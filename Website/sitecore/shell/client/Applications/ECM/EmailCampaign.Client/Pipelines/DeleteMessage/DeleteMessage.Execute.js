define(["sitecore"], function (sitecore) {
  return {
    priority: 3,
    execute: function (context) {
      if (!context.currentContext.confirmed) {
        context.aborted = true;
        return;
      }

      postServerRequest("EXM/DeleteMessage", { value: context.currentContext.messageId }, function (response) {
        context.aborted = true;
        if (response.error) {
          sitecore.trigger("alertdialog", response.errorMessage);
          return;
        }
        if (!response.type) {
          sitecore.trigger("alertdialog", sitecore.Resources.Dictionary.translate("ECM.Pipeline.DeleteMessage.DeleteFailed"));
          return;
        }
        context.aborted = false;
        if (response.type == "error") {
          sitecore.trigger("alertdialog", sitecore.Resources.Dictionary.translate("ECM.Pipeline.DeleteMessage.CouldNotBeFound").replaceAll("{0}", context.currentContext.messageName));
          return;
        }
        if (response.type == "notification") {
          sitecore.trigger("alertdialog", sitecore.Resources.Dictionary.translate("ECM.Pipeline.DeleteMessage.HasBeenDeleted").replaceAll("{0}", context.currentContext.messageName));
          return;
        }
      }, false);
    }
  };
});