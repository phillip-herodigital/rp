define([
  "sitecore",
  "/-/speak/v1/ecm/MessageTokenService.js",
  "/-/speak/v1/ecm/DialogBase.js"
], function (
  sitecore,
  MessageTokenService,
  DialogBase
  ) {
  return DialogBase.extend({
    initialized: function () {
      this._super();
      this.InsertTokensDialogListControl.on("change:items", this.onChangeItems, this);
    },
    onChangeItems: function() {
      this.InsertTokensDialogListControl.viewModel.$el.find("td[class='ventilate']").on("click", _.bind(function (e) {
        MessageTokenService.set("selectedToken", $(e.target).children(0).text());
        MessageTokenService.trigger("tokenSelected");
        this.hideDialog();
      }, this));
    }
  });
});