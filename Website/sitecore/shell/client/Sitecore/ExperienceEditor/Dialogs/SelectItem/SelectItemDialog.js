define(["sitecore", "/-/speak/v1/ExperienceEditor/Sitecore.ExperienceEditor.js"], function (Sitecore) {
  var selectItemDialog = Sitecore.Definitions.App.extend({
    translationContext: null,
    templateId: null,

    initialized: function () {
      this.setOkButtonClick();
      this.setCancelButtonClick();
      this.setItemSelected();
    },
    setOkButtonClick: function () {
      this.on("button:ok", function () {
        var resultType = this.ResultTypeText.attributes.text;
        var result = '';
        var item = this.ItemsListControl.get("selectedItem");
        switch (resultType) {
          case "Name":
            result = item.attributes.itemName;
            break;
          case "Path":
            result = item.attributes.$path;
            break;
          default:
            result = item.attributes.itemId;
            break;
        }

        window.top.returnValue = result;
        window.top.dialogClose();
      }, this);
    },
    setCancelButtonClick: function () {
      this.on("button:cancel", function () {
        window.top.dialogClose();
      }, this);
    },
    setItemSelected: function () {
      this.ItemsListControl.on("change:selectedItem", function () {
        if (this.ItemsListControl.get("selectedItem") == null || this.OkButton.attributes.isEnabled) {
          return;
        }

        this.OkButton.set("isEnabled", true);
      }, this);
    }
  });
  return selectItemDialog;
});