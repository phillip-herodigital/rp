define([
  "sitecore",
  "/-/speak/v1/ecm/DialogBase.js"
], function (sitecore, DialogBase) {
  return DialogBase.extend({
    showDialog: function (options) {
      this._super(options);
      var isTriggered = options.data.messageType == "Triggered";
      this.WhenYouSelectAWinnerTextTriggered.set("isVisible", isTriggered);
      this.WhenYouSelectAWinnerTextUsual.set("isVisible", !isTriggered);
    }
  });
});
