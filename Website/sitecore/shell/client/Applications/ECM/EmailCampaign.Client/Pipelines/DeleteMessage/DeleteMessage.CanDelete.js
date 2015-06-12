define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      postServerRequest("ecm.deletemessage.candelete", { value: context.currentContext.messageId }, function (response) {
        if (response.error) {
          sitecore.trigger("alertdialog", response.errorMessage);
          return;
        }
        if (!response.value) {
          sitecore.trigger("alertdialog", sitecore.Resources.Dictionary.translate("ECM.Pipeline.DeleteMessage.CanNotDelete"));
          context.aborted = true;
          return;
        }
      }, false);
    }
  };
});