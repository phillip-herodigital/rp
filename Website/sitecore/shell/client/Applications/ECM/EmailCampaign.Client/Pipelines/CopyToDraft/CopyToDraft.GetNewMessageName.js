define([
  "sitecore",
  "/-/speak/v1/ecm/DialogService.js",
  "/-/speak/v1/ecm/Validation.js"
], function (
  sitecore,
  DialogService,
  Validation
  ) {

  return {
    priority: 2,
    execute: function (context) {
      if (!context.confirmed) {
        context.aborted = true;

        DialogService.get('prompt')
          .done(function (dialog) {
            var validation = new Validation.create({
              id: 'CopyToDraftPrompt',
              inputs: [
                {
                  input: dialog.PromptTextBox,
                  validators: {
                    nameIsValid: {
                      params: {
                        expression: context.messageContext.get('itemNameValidation')
                      }
                    }
                  }
                }
              ]
            }).on({
              'validation:input:error': function (message) {
                dialog.PromptErrorText.set("text", message.text);
              },
              'validation:input:success': function () {
                dialog.PromptErrorText.viewModel.$el.addClass("control-label");
                dialog.PromptErrorText.set("text", "");
              },
              'change:valid': function () {
                dialog.Ok.set("isEnabled", validation.get('valid'));
              }
            }, this);

            dialog.PromptTextBox.on('change:text', _.once(function () {
              dialog.Ok.set("isEnabled", true);
            }));

            dialog.showDialog({
              text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CopyToDraft.NewName"),
              watermark: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CopyToDraft.NewNameWatermark"),
              on: {
                ok: function (text) {
                  sitecore.Pipelines.CopyToDraft.execute({
                    data: {
                      messageId: context.data.messageId,
                      messageName: dialog.PromptTextBox.get('text')
                    },
                    confirmed: true,
                    messageContext: context.messageContext
                  });
                },
                complete: function() {
                  validation.destroy();
                }
              }
            });
          });
      }
    }
  };
});