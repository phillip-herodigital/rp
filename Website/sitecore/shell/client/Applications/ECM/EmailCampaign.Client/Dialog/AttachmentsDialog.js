define(["sitecore", "underscore", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/Messages.js"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("attachments:dialog:show", this.showDialog, this);
      this.on("attachments:dialog:close", this.hideDialog, this);

      this.on("action:addattachment", function () {
        sitecore.trigger("action:addattachment", function () {
          sitecore.trigger("attachments:dialog:show");
        });
      });
      this.on("action:deleteattachment", function () { this.removeSelectedAttachments(); }, this);
    },
    showDialog: function (parameters) {
      if (parameters != null) {
        this.contextApp = parameters.contextApp;
        if (!this.messageContext) {
          parameters.messageContext.on("change:isReadonly", _.bind(function () {
            this.setAttachmentActionsEnabled(this.contextApp, this.messageContext);
          }, this));
        }

        this.messageContext = parameters.messageContext;
      }

      this.AttachmentsListControl.on("change:selectedItemId change:checkedItemIds change:items", _.bind(function () {
        this.setAttachmentActionsEnabled(this.contextApp, this.messageContext);
      }, this));

      sitecore.on("change:messageContext", _.bind(function () {
        this.AttachmentsListControl.set("items", this.contextApp.MessageContext.get("attachments"));
      }, this));

      this.AttachmentsListControl.set("items", this.contextApp.MessageContext.get("attachments"));

      this.setAttachmentActionsEnabled(this.contextApp, this.messageContext);

      this.AttachmentsDialog.show();
    },
    hideDialog: function () {
      this.AttachmentsDialog.hide();
    },

    setAttachmentActionsEnabled: function (contextApp, messageContext) {
      var list = this.AttachmentsListControl;
      var areActionsEnabled = !messageContext.get("isReadonly");
      var areAttachmentsSelected = list.get("selectedItemId") !== "" || (list.get("checkedItemIds").length > 0 && list.get("items").length > 0);

      this.AddAttachmentButton.set("isEnabled", areActionsEnabled);
      this.RemoveAttachmentButton.set("isEnabled", areActionsEnabled && areAttachmentsSelected);
    },

    removeSelectedAttachments: function () {
      if (!this.messageContext) {
        return;
      }

      var list = this.AttachmentsListControl;
      var checkedItemIds = list.get("checkedItemIds");

      if (!checkedItemIds || checkedItemIds.length === 0) {
        var selectedItemId = list.get("selectedItemId");

        if (selectedItemId === "") {
          return;
        }

        checkedItemIds = [selectedItemId];
      }

      var context = {
        attachmentIds: checkedItemIds,
        messageId: this.messageContext.get("messageId"),
        language: this.messageContext.get("language"),
        messageBar: this.MessageBar
      };

      sitecore.Pipelines.RemoveAttachment.execute({ app: this.contextApp, currentContext: context });
      list.set("selectedItemId", "");
    }
  });
});
