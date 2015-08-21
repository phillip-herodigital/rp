define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/Validation.js"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("dispatch:schedule:dialog:show", this.showDialog, this);
      this.on("dispatch:schedule:dialog:no", this.hideDialog, this);
      this.on("dispatch:schedule:dialog:yes", this.resume, this);
    },
    callBack: null,
    showDialog: function (callBack, message) {
      this.callBack = callBack;
      if (message) {
        var messageText = this.ConfirmText;
        messageText.set("text", message);
        messageText.viewModel.$el.attr("title", message);
      }
      this.ScheduleConfirmationDialog.show();
    },
    hideDialog: function () {
      this.ScheduleConfirmationDialog.hide();
    },
    resume: function () {
      this.callBack();

      this.hideDialog();
    }
  });
});
