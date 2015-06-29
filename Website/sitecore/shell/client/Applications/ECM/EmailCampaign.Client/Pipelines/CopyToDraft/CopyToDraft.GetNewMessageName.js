define(["sitecore"], function(sitecore) {
return {
    priority: 2,
    execute: function(context) {
      if (!context.confirmed) {
        context.aborted = true;

        sitecore.trigger("promptdialog",
        {
          text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CopyToDraft.NewName"),
          ok: function (text) {
            sitecore.Pipelines.CopyToDraft.execute({
              messageId: context.messageId,
              messageName: text,
              confirmed: true
            });
          },
          cancel: function () { }
        });
      }
    }
  };
});