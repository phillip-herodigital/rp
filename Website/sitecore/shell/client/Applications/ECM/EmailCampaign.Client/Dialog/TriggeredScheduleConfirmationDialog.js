define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/Validation.js"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("dispatch:triggered:schedule:dialog:show", this.showDialog, this);
      this.on("dispatch:triggered:schedule:dialog:no", this.hideDialog, this);
      this.on("dispatch:triggered:schedule:dialog:yes", this.resume, this);
    },
    callBack: null,
    showDialog: function (callBack) {
      this.callBack = callBack;

      // TODO remake for a dynamic height
      var modalBodyArray = this.TriggeredScheduleConfirmationDialog.viewModel.$el.find(".sc-dialogWindow-body");
      Array.prototype.filter.call(modalBodyArray, function (modalBodyElement) {
        $(modalBodyElement).css('overflow-y', 'auto');
        $(modalBodyElement).css('max-height', '140px');
      });

      this.TriggeredScheduleConfirmationDialog.show();
    },
    hideDialog: function () {
      this.TriggeredScheduleConfirmationDialog.hide();
    },
    resume: function () {
      this.callBack();

      this.hideDialog();
    }
  });
});
