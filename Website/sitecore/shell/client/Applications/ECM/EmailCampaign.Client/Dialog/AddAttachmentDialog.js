define([
    "sitecore",
    "jquery",
    "/-/speak/v1/ecm/DialogBase.js"
], function(
    sitecore,
    $,
    DialogBase
) {
    return DialogBase.extend({
        initialized: function() {
            this._super();
            this.on({
                "upload-fileUploaded": this.addAttachment,
                "attachment:file:addtoalllanguages": this.copyAttachmentToAllLanguages,
                "action:addattachment": this.onAddAttachment,
                "sc-error": this.onScError,
                "upload-fileAdded": this.onFileAdded
            }, this);
            sitecore.on({
                'addAttachments:error': function(message) {
                    this.MessageBar.addMessage('error', message);
                }
            }, this);
            this.Ok.set("isEnabled", false);
            var onChangeTotalUploaderSizeDebounced = _.debounce(this.onChangeTotalUploaderSize, 50);
            this.Uploader.on("change:totalFiles change:totalSize", onChangeTotalUploaderSizeDebounced, this);
        },

        getUploaderFilesTotalSize: function () {
            var files = this.UploaderInfo.viewModel.files(),            totalSize = 0;            _.each(files, function (file) {
                totalSize += file.size();
            });            return totalSize;
        },

        onChangeTotalUploaderSize: function () {
            if (this.getUploaderFilesTotalSize() < this.Uploader.get("maxRequestLength")) {
                this.Ok.set("isEnabled", true);
                this.MessageBar.removeMessage(function(error) {
                    return error.id === 'upload-error-fileSizeExceeded';
                });
            } else {
                this.Ok.set("isEnabled", false);
            }
        },

        ok: function() {
            this.upload();
            this.options.on.ok();
        },

        addAttachment: function(file) {
            var context = { file: file, messageId: this.options.data.messageId, language: this.options.data.language, messageBar: this.MessageBar };
            sitecore.Pipelines.AddAttachment.execute({ app: this, currentContext: context });
            $("[data-sc-id='UploaderInfo']").find("img[src*='" + file.name + "']").closest('div[class="sc-uploaderInfo-row"]').remove();
            if ($("div.sc-uploaderInfo-row").length < 1) {
                this.Ok.set("isEnabled", false);
            }
        },
        copyAttachmentToAllLanguages: function(args) {
            var context = { fileName: args.fileName, attachmentId: args.attachmentId, messageId: this.options.data.messageId, language: this.options.data.language, messageBar: this.MessageBar }
            sitecore.Pipelines.CopyAttachmentToAllLanguages.execute({ app: this, currentContext: context });
        },

        showDialog: function(options) {
            if (!options.data) {
                return;
            }
            this._super(options);
            this.MessageBar.removeMessages();
        },

        hideDialog: function() {
            this._super();
            //TODO: Make it hide
            this.UploaderInfo.set("isVisible", false);
            this.UploaderInfo.viewModel.hide();
        },

        upload: function() {
            var hasError = false;
            var $uploaderRow = $("div.sc-uploaderInfo-row");
            $uploaderRow.removeClass("error");
            var errorId = "upload-error-fileNameDoesntCorrect";
            this.MessageBar.removeMessage(function(err) {
                return err.id.indexOf(errorId) > -1;
            });
            var files = this.UploaderInfo.viewModel.files();
            _.each(files, _.bind(function(file, index) {
                var fileName = file.name();
                var specialSymbols = new RegExp(/[\~\!\@\#\$\%\^\&\*\)\(\+\=\.\_\-\[\]\{\}\\\|\`\;\:\'\/\?\,\<\>]/g);

                if (!fileName || specialSymbols.test(fileName)) {
                    hasError = true;
                    this.showError({
                        id: errorId + index,
                        Message: !fileName ? sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.FileNameEmpty") :
                            sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.FileNameSpecialSymbols")
                    });
                    $uploaderRow.eq(index).addClass("error");
                }
            }, this));
            if (!hasError) {
                this.MessageBar.removeMessages();
                this.Uploader.viewModel.upload();
            }
        },

        onAddAttachment: function() {
            sitecore.trigger("action:addattachment");
        },

        onFileAdded: function() {
            this.Ok.set("isEnabled", true);
        },

        onScError: function(errList) {
            _.each(errList, _.bind(function(error) {
                this.showError(error);
            }, this));
        }

    });
});