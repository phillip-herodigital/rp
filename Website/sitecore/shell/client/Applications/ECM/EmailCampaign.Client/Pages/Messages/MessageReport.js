define([
  "sitecore",
  "/-/speak/v1/ecm/constants.js",
  "/-/speak/v1/ecm/MessageBase.js",
  "/-/speak/v1/ecm/UrlService.js",
  "/-/speak/v1/ecm/ServerRequest.js",
  "/-/speak/v1/ecm/DialogService.js"
], function (
  sitecore,
  Constants,
  messageBase,
  urlService,
  ServerRequest,
  DialogService
  ) {
  var messageReport = messageBase.extend({
    initialized: function() {
      this._super();
      this.MessageInfo.set("hidePreviewForRecipient", true);
      this.loadPreviewImage();
      sitecore.on({
        "change:messageContext": this.onChangeMessageContext,
        "action:emailpreview": function () {
          DialogService.show("emailPreview", {
            data: {
              MessageContext: this.MessageContext,
              ImageUrl: this.MessagePreviewImage.get("imageUrl")
            }
          });
        }
      }, this);
    },

    setPageTitle: function() {
      document.title = this.MessageContext.get('messageName') +
        ' - ' +
        sitecore.Resources.Dictionary.translate("ECM.EmailExperienceManager");
    },

    onChangeMessageContext: function () {
      this.setPageTitle();
      this.updateLanguageSwitcher();
    },

    updateLanguageSwitcher: function () {
      var activeLanguages = this.LanguageSwitcher.viewModel.getActiveLanguages();
      if (this.MessageContext.get("messageState") !== Constants.MessageStates.DRAFT && activeLanguages.length > 1) {
        this.LanguageSwitcher.viewModel.showAllLanguagesItem();
      }
    },

    loadPreviewImage: function () {
        ServerRequest(Constants.ServerRequests.MESSAGE_PREVIEW_URL, {
        data: { messageId: this.MessageContext.get("messageId"), language: this.MessageContext.get("language") },
        success: function (response) {
          if (response.error) {
            contextApp.MessageBar.addMessage("error", { text: response.errorMessage, actions: [], closable: true });
            return;
          }
          if (response.url && response.url !== "") {
            var previewImage = this.MessagePreview.viewModel.getChild("Image");
            // Was decided to resize image on client side default size for preview image is 200px
            previewImage.viewModel.$el.addClass("sc-emailpreview");
            this.MessagePreview.set("imageUrl", response.url);
            this.MessagePreview.viewModel.getChild("ImageText").set("isVisible", false);
            this.MessagePreview.viewModel.$el.on("click", function() {
              sitecore.trigger("action:emailpreview");
            });
          }
        },    
        context: this
      });
    },

    attachEventHandlers: function () {
      this._super();
      this.on("refresh:message:context", function () {
        this.MessageContext.refresh();
      }, this);
    },

    initActions: function () {
      this._super();
      this.on("switch:to:message", this.switchToMessage, this);
    },

    switchToMessage: function () {
      var urlParams = this.getMessageUrlParams();
      var messagePath = urlService.getUrl("Messages" + this.MessageContext.get("messageType"), urlParams);
      location.href = messagePath;
    }
  });


  return messageReport;
});