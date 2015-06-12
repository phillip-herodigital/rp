﻿define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/Messages.js"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("save:as:subscription:dialog:show", this.showDialog, this);
      this.on("save:as:subscription:dialog:save", this.saveDialog, this);
      this.on("save:as:subscription:dialog:close", this.hideDialog, this);

    },
    showDialog: function (messageInfo) {
      if (!messageInfo) {
        return;
      }

      var contextApp = this;
      contextApp.messageInfo = messageInfo;
      this.NameTextBox.set("text", contextApp.messageInfo.messageContext.get("messageName"));
      this.TemplateImage.set("imageUrl", contextApp.messageInfo.messageContext.get("thumbnail"));

      // be sure to handle a not yet loaded recipient 
      if (!contextApp.messageInfo.contextApp.RecipientTabLoadOnDemandPanel.get("isLoaded")) {
        contextApp.messageInfo.contextApp.RecipientTabLoadOnDemandPanel.refresh();
        contextApp.messageInfo.contextApp.RecipientTabLoadOnDemandPanel.on("change:isLoaded", function () {
          contextApp.RecipentsListListBox.set("items", contextApp.messageInfo.contextApp.MessageContext.get("includedRecipients"));
          contextApp.SaveAsSubscriptionDialog.show();
        });
      } else {
        this.RecipentsListListBox.set("items", contextApp.messageInfo.contextApp.MessageContext.get("includedRecipients"));
        this.SaveAsSubscriptionDialog.show();
      }
    },
    saveDialog: function () {
      var contextApp = this;
      contextApp.currentContext = {
        messageId: contextApp.messageInfo.messageContext.get("messageId"),
        messageName: contextApp.NameTextBox.get("text").escapeAmpersand(),
        language: contextApp.messageInfo.messageContext.get("language"),
        messageBar: contextApp.MessageBar,
        messageBarMain: contextApp.messageInfo.contextApp.MessageBar,
        errorPopupResult: 0
      };
      sitecore.Pipelines.SaveAsSubscriptionTemplate.execute({ app: contextApp });
      if (contextApp.currentContext.errorPopupResult == 0) {
        
        if (!contextApp.aborted) {
          sitecore.trigger("message:switchtosubscriptionmessage");
          $('li[data-sc-actionid="0661D49FE0204040A255705AA20F67FA"]').hide();
        }
        this.SaveAsSubscriptionDialog.hide();
      }
    },
    hideDialog: function () {
      this.SaveAsSubscriptionDialog.hide();
    }
  });
});
