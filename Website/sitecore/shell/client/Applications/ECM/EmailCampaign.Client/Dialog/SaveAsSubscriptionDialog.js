define([
  "sitecore",
  "jquery",
  "/-/speak/v1/ecm/ServerRequest.js",
  "/-/speak/v1/ecm/Validation.js",
  "/-/speak/v1/ecm/DialogBase.js"
], function (
  sitecore,
  $,
  ServerRequest,
  Validation,
  DialogBase
  ) {
  return DialogBase.extend({
    setupValidation: function (nameExpression) {
      this.Validation = Validation.create({
        id: 'SaveAsSubscription',
        inputs: [
          {
            input: this.NameTextBox,
            validators: {
              nameIsValid: {
                params: {
                  expression: nameExpression
                }
              }
            }
          }]
      }).on({
        'validation:input:error': function (message) {
          this.MessageBar.removeMessage(function (mess) { return mess.id ? mess.id === message.id : false; });
          this.MessageBar.addMessage("error", _.extend({ actions: [], closable: true }, message));
        },
        'validation:input:success': function (message) {
          this.MessageBar.removeMessage(function (mess) { return mess.id ? mess.id.indexOf(message.id) > -1 : false; });
        },
        'change:valid': function () {
          this.Ok.set("isEnabled", this.Validation.get('valid'));
        }
      }, this);
    },

    showDialog: function (options) {
      this._super(options);
      this.setupValidation(options.data.messageContext.get('itemNameValidation'));
      if (options.data) {
        this.NameTextBox.set("text", options.data.messageContext.get("messageName"));
        this.TemplateImage.set("imageUrl", options.data.messageContext.get("thumbnail"));

        if (this.IncludedRecipientDataSource) {
          this.IncludedRecipientDataSource.set("messageId", options.data.messageContext.get("messageId"));
          this.IncludedRecipientDataSource.viewModel.refresh();
        }
      }
    },
    ok: function () {
      var params = {
        messageId: this.options.data.messageContext.get("messageId"),
        messageName: _.escape(this.NameTextBox.get("text")),
        language: this.options.data.messageContext.get("language"),
        messageBar: this.MessageBar,
        messageBarMain: this.options.data.contextApp.MessageBar,
        errorPopupResult: 0
      };
      sitecore.Pipelines.SaveAsSubscriptionTemplate.execute(params);
      if (params.errorPopupResult == 0) {
        if (!params.aborted) {
          sitecore.trigger("message:switchtosubscriptionmessage");
          $('li[data-sc-actionid="0661D49FE0204040A255705AA20F67FA"]').hide();
        }
        this._super();
      }
    },
    complete: function() {
      this._super();
      this.Validation.destroy();
      this.MessageBar.removeMessages();
    }
  });
});
