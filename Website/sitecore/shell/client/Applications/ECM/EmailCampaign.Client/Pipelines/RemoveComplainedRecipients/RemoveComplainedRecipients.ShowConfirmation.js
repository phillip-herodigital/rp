﻿define(["sitecore"], function (sitecore) {
  return {
    priority: 10,

    execute: function (context) {
      var text = sitecore.Resources.Dictionary.translate("ECM.Pages.Recipients.RemoveComplainedConfirmation").replaceAll("{0}", context.recipientList.name);
     
      if (!context.confirmed) {
        context.aborted = true;

        sitecore.trigger("confirmdialog",
        {
          text: text,
          ok: function () {
            sitecore.Pipelines.RemoveComplainedRecipients.execute({
              recipientList: context.recipientList,
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