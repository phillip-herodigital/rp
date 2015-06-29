define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      postServerRequest("ecm.copytodraft.checkpermissions", { value: context.messageId }, function (response) {
        if (response.error) {
          sitecore.trigger("alertdialog", response.errorMessage);
          context.aborted = true;
          return;
        }

        if (!response.value) {
          sitecore.trigger("alertdialog", sitecore.Resources.Dictionary.translate("ECM.Pipeline.CopyToDraft.DoNotHavePermissions"));
          context.aborted = true;
          return;
        }
      }, false);
    }
  };
});