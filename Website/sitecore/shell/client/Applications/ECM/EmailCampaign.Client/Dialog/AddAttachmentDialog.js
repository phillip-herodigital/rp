define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("add:attachment:dialog:show", this.showDialog, this);
      this.on("add:attachment:dialog:close", this.hideDialog, this);
      this.on("add:attachment:dialog:upload", this.upload, this);
      this.on("upload-fileUploaded", this.addAttachment, this);

      this.on("attachment:file:addtoalllanguages", this.copyAttachmentToAllLanguages, this);
    },
    
    addAttachment: function (file) {
      var contextApp = this;
      contextApp.currentContext = { file: file, messageId: contextApp.messageInfo.messageId, language: contextApp.messageInfo.language, messageBar: contextApp.MessageBar };
      var context = clone(contextApp.currentContext);
      sitecore.Pipelines.AddAttachment.execute({ app: contextApp, currentContext: context });
    },

    copyAttachmentToAllLanguages: function (args) {
      var contextApp = this;
      contextApp.currentContext = { fileName: args.fileName, attachmentId: args.attachmentId, messageId: contextApp.messageInfo.messageId, language: contextApp.messageInfo.language, messageBar: contextApp.MessageBar };
      var context = clone(contextApp.currentContext);
      sitecore.Pipelines.CopyAttachmentToAllLanguages.execute({ app: contextApp, currentContext: context });
    },
    
    showDialog: function (messageInfo) {
      if (!messageInfo)
        return;
      var contextApp = this;
      contextApp.messageInfo = messageInfo;
      this.AddAttachmentDialog.show();
    },
    hideDialog: function () {
      var dialog = this;
      //TODO: Make it hide
      dialog.UploaderInfo.set("isVisible", false);
      dialog.UploaderInfo.viewModel.hide();
      this.AddAttachmentDialog.hide();
    },
    upload: function () {
      this.Uploader.viewModel.upload();
    }
  });
});
