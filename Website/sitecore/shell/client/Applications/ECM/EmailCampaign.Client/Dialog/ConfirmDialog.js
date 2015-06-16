define(["sitecore"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("confirmdialog:show", this.showDialog, this);
      this.on("confirmdialog:ok", this.ok, this);
      this.on("confirmdialog:cancel", this.cancel, this);
      this.set("callbackok", null);
      this.set("callbackcancel", null);
    },
    showDialog: function (info) {
      this.set("callbackok", info.ok);
      this.set("callbackcancel", info.cancel);
      this.ConfirmText.set("text", info.text);
      this.ConfirmDialogWindow.show();
    },
    ok: function () {
      var func = this.get("callbackok");
      if (typeof func === "function") {
        func();
      }

      this.ConfirmDialogWindow.hide();
    },
    cancel: function () {
      var func = this.get("callbackcancel");
      if (typeof func === "function") {
        func();
      }

      this.ConfirmDialogWindow.hide();
    }
  });
});