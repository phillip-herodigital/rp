define([
  "sitecore",
  "/-/speak/v1/ecm/DialogBase.js",
  "/-/speak/v1/ecm/ManagerRootService.js"
], function (
  sitecore,
  DialogBase,
  ManagerRootService
  ) {
  return DialogBase.extend({
    showDialog: function (options) {
      this._super(options);
      this.MessageLanguageName.set("text", options.languageName);
      window.dialogParameters = options;
      if (options.dispatchDetails.usePreferredLanguage) {
        this.PreferredLanguageBorder.set("isVisible", true);
      } else {
        this.PreferredLanguageBorder.set("isVisible", false);
      }
    },
    hideDialog: function () {
      this._super();
      var rootList = ManagerRootService.getManagerRootList();
      if (!rootList.length) {
        location.reload();
      }
    },
    ok: function () {
      sitecore.Pipelines.DispatchMessage.execute({ app: this.options.app, currentContext: this.options.currentContext });
      this._super();
    }
  });
});
