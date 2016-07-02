define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      postServerRequest("EXM/CanDeleteFolder", { value: context.currentContext.folderId }, function (response) {
        if (response.error) {
          sitecore.trigger("alertdialog", response.errorMessage);
          return;
        }
        if (!response.value) {
          sitecore.trigger("alertdialog", sitecore.Resources.Dictionary.translate("ECM.Pipeline.DeleteFolder.CanNotDelete"));
          context.aborted = true;
          return;
        }
      }, false);
    }
  };
});