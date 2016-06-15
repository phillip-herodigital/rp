define([
  "sitecore",
  "/-/speak/v1/ecm/DialogService.js"
], function (
  sitecore,
  DialogService
  ) {
  return {
    priority: 10,

    execute: function (context) {
      var text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.RemoveComplainedConfirmation")
        .split("{0}").join(context.recipientList.name);
     
      if (!context.confirmed) {
        context.aborted = true;

        DialogService.show('confirm', {
          text: text,
          on: {
            ok: function () {
              sitecore.Pipelines.RemoveComplainedRecipients.execute({
                recipientList: context.recipientList,
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