define([
  "sitecore",
  "/-/speak/v1/ecm/MessageTokenService.js",
  "/-/speak/v1/ecm/DialogBase.js"
], function (
  sitecore,
  MessageTokenService,
  DialogBase
  ) {
  return DialogBase.extend({
    attachHandlers: function () {
      this._super();
      this.on({
        'add:attachment:dialog:close': this.hideDialog,
        'action:message:recipients:search': this.onRecipientsSearch
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
      this._super();
    },

    showDialog: function (options) {
      this._super(options);
      this.RecipientPreviewDataSource.set("loadRecipients", true);
      this.RecipientPreviewDataSource.set("messageId", options.data.messageContext.get("messageId"));
      this.RecipientPreviewDataSource.refreshRecipients();
    }
  });
});
