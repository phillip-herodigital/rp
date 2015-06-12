define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/Validation.js"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("dispatch:cancelscheduling:confirmation:dialog:show", this.showDialog, this);
      this.on("dispatch:cancelscheduling:confirmation:dialog:no", this.hideDialog, this);
      this.on("dispatch:cancelscheduling:confirmation:dialog:yes", this.cancelScheduling, this);
    },
    callBack: null,
    showDialog: function (callBack) {
      this.callBack = callBack;

      // TODO remake for a dynamic height
      var modalBodyArray = this.CancelSchedulingConfirmationDialog.viewModel.$el.find(".sc-dialogWindow-body");
      Array.prototype.filter.call(modalBodyArray, function (modalBodyElement) {
        $(modalBodyElement).css('overflow-y', 'auto');
        $(modalBodyElement).css('max-height', '140px');
      });

      this.CancelSchedulingConfirmationDialog.show();
    },
    hideDialog: function () {
      this.CancelSchedulingConfirmationDialog.hide();
    },
    cancelScheduling: function () {
      this.callBack();

      this.hideDialog();
    }
  });
});
