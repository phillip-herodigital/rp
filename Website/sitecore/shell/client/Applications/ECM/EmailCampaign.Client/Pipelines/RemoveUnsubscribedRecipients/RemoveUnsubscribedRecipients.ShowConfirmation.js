define(["sitecore"], function(sitecore) {
  return {
    execute: function (context) {
      var listNames = [];
      for (var i = 0; i < context.recipientLists.length; i++) {
        listNames[i] = context.recipientLists[i].name;
      }
      var text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.RemoveUnsubscribedConfirmation").replaceAll("{0}", listNames.join());

      if (!context.confirmed) {
        context.aborted = true;

        sitecore.trigger("confirmdialog",
        {
          text: text,
          ok: function () {
            sitecore.Pipelines.RemoveUnsubscribedRecipients.execute({
              recipientLists: context.recipientLists,
              messageId: context.messageId,
              messageBar: context.messageBar,
              confirmed: true
            });
          },
          cancel: function () { }
        });
      }
    }
  };
});