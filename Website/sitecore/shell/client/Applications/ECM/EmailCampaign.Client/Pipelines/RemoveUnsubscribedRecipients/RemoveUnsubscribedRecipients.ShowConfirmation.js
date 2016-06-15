define(["sitecore", "/-/speak/v1/ecm/DialogService.js"], function (sitecore, DialogService) {
  return {
    execute: function (context) {
      var listNames = [];
      for (var i = 0; i < context.recipientLists.length; i++) {
        listNames[i] = context.recipientLists[i].name;
      }
      var text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.RemoveUnsubscribedConfirmation")
        .split("{0}").join(listNames.join());

      if (!context.confirmed) {
        context.aborted = true;

        DialogService.show('confirm', {
          text: text,
          on: {
            ok: function () {
              sitecore.Pipelines.RemoveUnsubscribedRecipients.execute({
                recipientLists: context.recipientLists,
                messageId: context.messageId,
                messageBar: context.messageBar,
                confirmed: true
              });
            }
          }
        });
      }
    }
  };
});