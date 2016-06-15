define(["sitecore", "/-/speak/v1/ecm/DialogService.js"], function (sitecore, DialogService) {
  return {
    priority: 2,
    execute: function (context) {
      if (!context.currentContext.confirmed) {
        context.aborted = true;
        DialogService.show('confirm', {
          text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.DeleteMessage.ConfirmDelete")
            .split("{0}").join(context.currentContext.messageName),
          on: {
            ok: function () {
              context.currentContext.confirmed = true;
              context.aborted = false;
              sitecore.Pipelines.DeleteMessage.execute(context);
            }
          }
        });
      }
    }
  };
});