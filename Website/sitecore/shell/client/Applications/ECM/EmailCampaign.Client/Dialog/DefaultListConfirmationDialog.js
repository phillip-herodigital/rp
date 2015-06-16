(function () {
  define(["sitecore"], function (sitecore) {
    return sitecore.Definitions.App.extend({
      callback: null,
      initialized: function () {
        this.on("default:list:confirmation:dialog:no", this.noButtonClicked, this);
        this.on("default:list:confirmation:dialog:yes", this.yesButtonClicked, this);
      },
      showDialog: function (message, callBack) {
        this.DefaultListConfirmationDialogBorderText.set('text', message);
        this.callback = callBack;
        this.DefaultListConfirmationDialog.show();
      },
      noButtonClicked: function () {
        this.DefaultListConfirmationDialog.hide();
      },
      yesButtonClicked: function () {
        this.DefaultListConfirmationDialog.hide();
        this.callback();
      }
    });
  });
})();