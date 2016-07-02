define(["sitecore"], function (sitecore) {
  return {
    priority: 2,
    execute: function (context) {
      postServerRequest("EXM/DeleteFolder", { value: context.currentContext.folderId }, function (response) {
        if (response.error) {
          sitecore.trigger("alertdialog", response.errorMessage);
          context.aborted = true;
          return;
        }
        if (!response.value) {
          sitecore.trigger("alertdialog", sitecore.Resources.Dictionary.translate("ECM.Pipeline.DeleteFolder.DeleteFailed"));
          context.aborted = true;
          return;
        }
      }, false);
    }
  };
});