define(["sitecore", "/-/speak/v1/ecm/MessageTokenService.js"], function (sitecore, MessageTokenService) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      this.attachEventHandlers();
    },

    attachEventHandlers: function() {
      this.on({
        'add:attachment:dialog:close': this.hideDialog,
        'action:message:recipients:search': this.onRecipientsSearch,
        'preview:recipients:dialog:ok': this.ok,
        'preview:recipients:dialog:cancel': this.hideDialog
      }, this);
    },

    onRecipientsSearch: function () {
      this.RecipientPreviewDataSource.set("search", this.RecipientPreviewSearchButtonTextBox.get("text"));
    },

    getPersonalizationContactId: function() {
      var personalizationContactId = this.RecipientPreviewListControl.get("selectedItemId");
      this.personalizationContactId = personalizationContactId !== "" ? personalizationContactId : null;
      return this.personalizationContactId;
    },

    ok: function () {
      var personalizationContactId = this.getPersonalizationContactId();

      sitecore.trigger("change:personalizationRecipientId", (personalizationContactId) ?
        ("xdb:" + personalizationContactId) :
        null);

      sitecore.trigger("action:previewRecipientSelected", this.RecipientPreviewListControl.get("selectedItem"));

      MessageTokenService.set("context", {
        managerRootId: sessionStorage.managerRootId,
        contactId: personalizationContactId
      });
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
      //TODO: Make it hide
      this.RecipientsPreviewDialog.hide();
    }
  });
});
