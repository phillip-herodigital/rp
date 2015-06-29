define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/Validation.js"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("dispatch:confirmation:dialog:show", this.showDialog, this);
      this.on("dispatch:confirmation:dialog:no", this.hideDialog, this);
      this.on("dispatch:confirmation:dialog:yes", this.dispatch, this);
    },
    dialogParameters: null,
    showDialog: function (languageName, confirmationDialogParameters) {
      
      // TODO remake for a dynamic height
      var modalBodyArray = this.DispatchConfirmationDialog.viewModel.$el.find(".sc-dialogWindow-body");
      Array.prototype.filter.call(modalBodyArray, function (modalBodyElement) {
        $(modalBodyElement).css('overflow-y', 'auto');
        $(modalBodyElement).css('max-height', '200px');
      });

      this.MessageLanguageName.set("text", languageName);
      window.dialogParameters = confirmationDialogParameters;
      if (confirmationDialogParameters.dispatchDetails.usePreferredLanguage) {
        this.PreferredLanguageBorder.set("isVisible", true);
      } else {
        this.PreferredLanguageBorder.set("isVisible", false);
      }

      this.DispatchConfirmationDialog.show();
    },
    hideDialog: function () {
      var rootList = sitecore.Definitions.Views.ManagerRootSwitcher.prototype.getRootsList();
      if (rootList.length == 0) {
        this.DispatchConfirmationDialog.hide();
        location.reload();
      } else {
        this.DispatchConfirmationDialog.hide();
      }
    },
    dispatch: function () {
      sitecore.Pipelines.DispatchMessage.execute({ app: dialogParameters.app, currentContext: dialogParameters.currentContext });

      this.hideDialog();
    }
  });
});
