define(["sitecore", "/-/speak/v1/ecm/String.js"], function (sitecore) {
  return {
    priority: 2,
    execute: function (context) {
      if (!context.currentContext.confirmed) {
        context.aborted = true;

        sitecore.trigger("confirmdialog",
        {
          text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.DeleteMessage.ConfirmDelete").replaceAll("{0}", context.currentContext.messageName),
          ok: function () {
            context.currentContext.confirmed = true;
            sitecore.Pipelines.DeleteMessage.execute({ app: sitecore, currentContext: context.currentContext });
          },
          cancel: function () {}
        });
      }
    }
  };
});