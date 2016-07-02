define(["sitecore", "underscore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("add:attachment:dialog:show", this.showDialog, this);
      this.on("add:attachment:dialog:close", this.hideDialog, this);
      this.on("add:attachment:dialog:upload", this.upload, this);
      this.on("upload-fileUploaded", this.addAttachment, this);
      this.on("attachment:file:addtoalllanguages", this.copyAttachmentToAllLanguages, this);

      this.AddAttachmentDialog.on("hide", _.bind(function () {
        if (this.callback != null) {
          this.callback();
        }
      }, this));

      this.on("sc-error", function (errList) {
        _.each(errList, function (error) {
          this.showError(error);
        });
      }, this);

      this.on("upload-fileAdded", function () { this.Upload.set("isEnabled", true) }, this);

      this.Upload.set("isEnabled", false);
    },

    addAttachment: function (file) {
      var contextApp = this;
      contextApp.currentContext = { file: file, messageId: contextApp.messageInfo.messageId, language: contextApp.messageInfo.language, messageBar: contextApp.MessageBar };
      var context = clone(contextApp.currentContext);
      sitecore.Pipelines.AddAttachment.execute({ app: contextApp, currentContext: context });
      $("[data-sc-id='UploaderInfo']").find("img[src*='" + file.name + "']").closest('div[class="sc-uploaderInfo-row"]').remove();
      if ($("div.sc-uploaderInfo-row").length < 1) {
        this.Upload.set("isEnabled", false);
      }
    },
    copyAttachmentToAllLanguages: function (args) {
      var contextApp = this;
      contextApp.currentContext = { fileName: args.fileName, attachmentId: args.attachmentId, messageId: contextApp.messageInfo.messageId, language: contextApp.messageInfo.language, messageBar: contextApp.MessageBar };
      var context = clone(contextApp.currentContext);
      sitecore.Pipelines.CopyAttachmentToAllLanguages.execute({ app: contextApp, currentContext: context });
    },
    showDialog: function (messageInfo, callback) {
      if (!messageInfo) {
        return;
      }
      this.callback = callback;
      var contextApp = this;
      contextApp.messageInfo = messageInfo;
      this.AddAttachmentDialog.show();
      this.MessageBar.removeMessages();
    },
    hideDialog: function () {
      var dialog = this;
      //TODO: Make it hide
      dialog.UploaderInfo.set("isVisible", false);
      dialog.UploaderInfo.viewModel.hide();
      this.AddAttachmentDialog.hide();
    },
    showError: function(err) {
      this.MessageBar.addMessage("error", {
        id: err.id,
        text: err.Message,
        actions: [],
        closable: true
      });
    } ,
    upload: function () {
      var hasError = false;
      var $uploaderRow = $("div.sc-uploaderInfo-row");
      $uploaderRow.removeClass("error");
      var errorId = "upload-error-fileNameDoesntCorrect";
      this.MessageBar.removeMessage(function (err) { return err.id.indexOf(errorId) > -1; });
      var i = 0;
      var that = this;
      var files = this.UploaderInfo.viewModel.files();
      _.each(files, function (file) {
        var fileName = file.name();
        if (!fileName) {
          hasError = true;
          that.showError({ id: errorId + i, Message: sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.FileNameEmpty") });
          $uploaderRow.eq(i).addClass("error");
        }
        var specialSymbols = new RegExp(/[\~\!\@\#\$\%\^\&\*\)\(\+\=\.\_\-\[\]\{\}\\\|\`\;\:\'\/\?\,\<\>]/g);
        if (specialSymbols.test(fileName)) {
          hasError = true;
          that.showError({ id: errorId + i, Message: sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.FileNameSpecialSymbols") });
          $uploaderRow.eq(i).addClass("error");
        }
        i++;
      });
      if (!hasError) {
        this.MessageBar.removeMessages();
        this.Uploader.viewModel.upload();
      }
    }
  });
});