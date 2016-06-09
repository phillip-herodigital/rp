define(["sitecore", "/-/speak/v1/ecm/DialogBase.js"], function (sitecore, DialogBase) {
  return DialogBase.extend({
    showDialog: function (options) {
      this._super(options);
      this.ActivateMessageLanguageName.set("text", options.langaugeName);
      if (options.usePreferredLanguage) {
        this.ActivatePreferredLanguageBorder.set("isVisible", true);
      } else {
        this.ActivatePreferredLanguageBorder.set("isVisible", false);
      }
    }
  });
});
