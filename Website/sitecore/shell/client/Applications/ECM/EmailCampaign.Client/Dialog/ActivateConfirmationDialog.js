define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/Validation.js"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("dispatch:triggered:activate:dialog:show", this.showDialog, this);
      this.on("dispatch:triggered:activate:dialog:no", this.hideDialog, this);
      this.on("dispatch:triggered:activate:dialog:yes", this.resume, this);
    },
    callBack: null,
    showDialog: function (callBack, langaugeName, usePreferredLanguage) {
      this.callBack = callBack;

      // TODO remake for a dynamic height
      var modalBodyArray = this.ActivateConfirmationDialog.viewModel.$el.find(".sc-dialogWindow-body");
      Array.prototype.filter.call(modalBodyArray, function (modalBodyElement) {
        $(modalBodyElement).css('overflow-y', 'auto');
        $(modalBodyElement).css('max-height', '200px');
      });

      this.ActivateMessageLanguageName.set("text", langaugeName);
      if (usePreferredLanguage) {
        this.ActivatePreferredLanguageBorder.set("isVisible", true);
      } else {
        this.ActivatePreferredLanguageBorder.set("isVisible", false);
      }

      this.ActivateConfirmationDialog.show();
    },
    hideDialog: function () {
      this.ActivateConfirmationDialog.hide();
    },
    resume: function () {
      this.callBack();

      this.hideDialog();
    }
  });
});
