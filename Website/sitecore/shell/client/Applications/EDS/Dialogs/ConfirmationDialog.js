define(["sitecore"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    imagePaths: {
      "warning": "/sitecore/shell/themes/standard/Images/warning.png",
      "error": "/sitecore/shell/themes/standard/Images/error.png",
      "delete": "~/icon/Office/48x48/delete.png"
    },
    initialized: function () {
      this.on({
        "app:loaded": this.triggerLoaded,
        "confirmationdialog:hide": this.hideDialog,
        "confirmationdialog:submit": this.submitAction
      }, this);

      this.set("callback", null);
      this.set("defaultTitle", this.getDialogTitle());
      this.DialogWindow.set("focusOn", "[data-sc-id=OkButton]");
    },

    triggerLoaded: function () {
      sitecore.trigger("eds:dialog:loaded", this);
    },

    showDialog: function (dialogParams) {
      this.set("callback", dialogParams.callback);

      this.setButtonsState(dialogParams);

      this.ConfirmText.set("text", dialogParams.text);
      this.ConfirmIcon.set("imageUrl", this.imagePaths[dialogParams.dialogType] || this.imagePaths.warning);
      
      this.setDialogTitle(dialogParams.title ? dialogParams.title : this.get("defaultTitle"));

      this.DialogWindow.show();
    },

    hideDialog: function () {
      this.DialogWindow.hide();
    },

    submitAction: function () {
      var func = this.get("callback");
      if (typeof func === "function") {
        func();
      }

      this.DialogWindow.hide();
    },

    getDialogTitle: function () {
      var title = this.DialogWindow.viewModel.$el.find(".sc-dialogWindow-header-title");
      if (title.length) {
        return title.text();
      } else {
        return null;
      }
    },

    setDialogTitle: function (titleText) {
      var title = this.DialogWindow.viewModel.$el.find(".sc-dialogWindow-header-title");
      if (title.length) {
        title.text(titleText);
      }
    },

    setButtonsState: function (options) {
      var alertMode = options ? options.alertMode == true : false;
      
      this.CancelButton.set("isVisible", !alertMode);
      var closeButton = this.DialogWindow.viewModel.$el.find(".sc-dialogWindow-close");
      closeButton[alertMode ? 'hide' : 'show']();
      this.DialogWindow.set("keyboard", (!alertMode).toString());
    }
  });
});