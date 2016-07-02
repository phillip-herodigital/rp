define(["sitecore", "/-/speak/v1/ecm/MessageTokenService.js"], function (sitecore, MessageTokenService) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("personalization:token:dialog:show", this.showDialog, this);
      sitecore.on("personalization:token:dialog:hide", this.hideDialog, this);
      this.InsertTokensDialogListControl.on("change:items", this.onChangeItems, this);
    },
    onChangeItems: function() {
      this.InsertTokensDialogListControl.viewModel.$el.find("td[class='ventilate']").on("click", function () {
        MessageTokenService.set("selectedToken", $(this).children(0).text());
        MessageTokenService.trigger("tokenSelected");
        sitecore.trigger("personalization:token:dialog:hide");
      });
    },
    showDialog: function () {
      this.TokensDialog.show();
    },
    hideDialog: function () {
      this.TokensDialog.hide();
    }
  });
});