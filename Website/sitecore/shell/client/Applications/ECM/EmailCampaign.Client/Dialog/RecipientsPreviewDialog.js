define(["sitecore", "/-/speak/v1/ecm/MessageTokenService.js", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore, MessageTokenService) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("preview:recipients:dialog:show", this.showDialog, this);
      this.on("add:attachment:dialog:close", this.hideDialog, this);
      this.on("action:message:recipients:search", function () {
        this.RecipientPreviewDataSource.set("search", this.RecipientPreviewSearchButtonTextBox.get("text"));
      });
      this.on("preview:recipients:dialog:ok", this.ok, this);
      this.on("preview:recipients:dialog:cancel", this.cancel, this);
    },

    ok: function () {
      var personalizationContactId = this.RecipientPreviewListControl.get("selectedItemId");
      if (personalizationContactId === "") {
        personalizationContactId = null;
      }

      sitecore.trigger("change:personalizationRecipientId", (personalizationContactId) ?
        ("xdb:" + personalizationContactId) :
        null);

      this.personalizationContactId = personalizationContactId;

      sitecore.trigger("action:previewRecipientSelected", this.RecipientPreviewListControl.get("selectedItem"));

      MessageTokenService.set("context", {
        managerRootId: sessionStorage.managerRootId,
        contactId: personalizationContactId
      });
      this.hideDialog();
    },

    cancel: function () {
      this.hideDialog();
    },

    showDialog: function (context) {
      if (!context)
        return;

      this.context = context;
      this.RecipientsPreviewDialog.show();
      this.RecipientPreviewDataSource.set("loadRecipients", true);
      this.RecipientPreviewDataSource.set("messageId", context.messageContext.get("messageId"));
      this.RecipientPreviewDataSource.refreshRecipients();
    },
    hideDialog: function () {
      var dialog = this;
      //TODO: Make it hide
      this.RecipientsPreviewDialog.hide();
    }
  });
});
