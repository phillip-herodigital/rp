define(["sitecore", "/-/speak/v1/ecm/EmailPreviewDetailsDialog.js"], function (sitecore, EmailPreviewDetailsDialog) {
  return EmailPreviewDetailsDialog.extend({
    onChangeIndex: function () {
      var list = this.model.get('list'),
        itemData = list[this.model.get('index')];

      this.SpamCheckNameText.set("text", itemData.name);
      this.SpamCheckDetailsText.set("text", itemData.body);
      this.SpamCheckTitleText.set("text", itemData.title);

      this.updateTitle(itemData.name + ' ' + this.defaults.title);
    }
  });
});
