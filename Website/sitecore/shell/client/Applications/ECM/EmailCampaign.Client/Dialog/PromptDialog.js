define([
  "sitecore",
  "/-/speak/v1/ecm/DialogBase.js"
], function (
  sitecore,
  DialogBase
  ) {
  return DialogBase.extend({
    initialized: function () {
      this._super();
      this.defaults.text = this.PromptText.get("text");
      this.defaults.inputText = "";
      this.defaults.watermark = this.PromptTextBox.get("watermark");
      this.Ok.set("isEnabled", false);
    },
    update: function() {
      this.PromptText.set("text", this.options.text);
      this.PromptTextBox.set("watermark", this.options.watermark);
      this.PromptTextBox.set("text", this.options.inputText);
      this._super();
    },
    resetDefaults: function() {
      this._super();
      this.PromptText.set("text", this.defaults.text);
      this.PromptTextBox.set("watermark", this.defaults.watermark);
      this.PromptTextBox.set("text", this.defaults.inputText);
      this.Ok.set("isEnabled", false);
      this.PromptErrorText.viewModel.$el.addClass("control-label");
      this.PromptErrorText.set("text", "");
      this.PromptTextBox.viewModel.$el.parent().removeClass("has-error");
    }
  });
});