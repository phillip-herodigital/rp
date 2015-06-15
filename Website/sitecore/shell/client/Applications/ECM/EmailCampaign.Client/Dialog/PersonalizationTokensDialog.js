define(["sitecore", "/-/speak/v1/ecm/InsertToken.js"], function (sitecore) {
  return sitecore.Definitions.App.extend({
    initialized: function () {
      sitecore.on("personalization:token:dialog:show", this.showDialog, this);
      sitecore.on("personalization:token:dialog:hide", this.hideDialog, this);
      this.InsertTokensDialogListControl.on("change:items", function () {
        this.InsertTokensDialogListControl.viewModel.$el.find("td[class='ventilate']").on("click", function () {
          InsertToken.PasteText($(this).children(0).text(), sitecore.Resources.Dictionary.translate("ECM.Message.NoFocusedElement"));
          sitecore.trigger("personalization:token:dialog:hide");
        });
      }, this);
    },
    showDialog: function () {
      this.TokensDialog.show();
    },
    hideDialog: function () {
      this.TokensDialog.hide();
    }
  });
});