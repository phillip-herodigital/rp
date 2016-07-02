define(["sitecore"], function (sitecore) {
  var defaults = {
    text: "",
    title: ""
  }

  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("confirmdialog:show", this.showDialog, this);
      this.on("confirmdialog:ok", this.ok, this);
      this.on("confirmdialog:cancel", this.cancel, this);
      this.set("callbackok", null);
      this.set("callbackcancel", null);
      defaults.text = this.ConfirmText.get("text");
      defaults.title = this.getDialogTitle();
    },
    showDialog: function (info) {
      this.set("callbackok", info.ok);
      this.set("callbackcancel", info.cancel);
      this.ConfirmText.set("text", info.text);
      if (info.title) {
        this.setDialogTitle(info.title);
      }
      this.ConfirmDialogWindow.show();
    },
    ok: function () {
      var func = this.get("callbackok");
      if (typeof func === "function") {
        func();
      }

      this.ConfirmDialogWindow.hide();
      this.resetDefaults();
    },
    cancel: function () {
      var func = this.get("callbackcancel");
      if (typeof func === "function") {
        func();
      }

      this.ConfirmDialogWindow.hide();
      this.resetDefaults();
    },
    getDialogTitle: function() {
      var title = this.ConfirmDialogWindow.viewModel.$el.find(".sc-dialogWindow-header-title");
      if (title.length) {
        return title.text();
      } else {
        return null;
      }
    },
    setDialogTitle: function (titleText) {
      var title = this.ConfirmDialogWindow.viewModel.$el.find(".sc-dialogWindow-header-title");
      if (title.length) {
        title.text(titleText);
      }
    },
    resetDefaults: function() {
      this.ConfirmText.set("text", defaults.text);
      this.setDialogTitle(defaults.title);
    }
  });
});