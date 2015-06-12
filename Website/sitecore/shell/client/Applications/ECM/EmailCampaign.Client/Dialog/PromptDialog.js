define(["sitecore"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("promptdialog:show", this.showDialog, this);
      this.on("promptdialog:ok", this.ok, this);
      this.on("promptdialog:cancel", this.cancel, this);
      this.set("callbackok", null);
      this.set("callbackcancel", null);
    },
    showDialog: function (info) {
      this.PromptInputTextBox.set("text", "");
      this.set("callbackok", info.ok);
      this.set("callbackcancel", info.cancel);
      
      this.PromptText.set("text", info.text);
      this.PromptDialogWindow.show();
    },
    ok: function () {
      var func = this.get("callbackok");
      if (typeof func === "function") {
        func(this.PromptInputTextBox.get("text"));
      }

      this.PromptDialogWindow.hide();
    },
    cancel: function () {
      var func = this.get("callbackcancel");
      if (typeof func === "function") {
        func();
      }

      this.PromptDialogWindow.hide();
    }
  });
});