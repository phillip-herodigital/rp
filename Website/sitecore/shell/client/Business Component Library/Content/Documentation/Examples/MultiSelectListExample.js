define(["sitecore"], function (_sc) {
  var model = Sitecore.Definitions.Models.ControlModel;
  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();
      if (this.app && this.app.ListControl) {
        this.app.ListControl.on("change", this.changedHandler);
        
      }
    },
    changedHandler: function () {
      if (this.get("checkedItems")) {
        this.viewModel.app.itemsPreview.set("text", this.get("checkedItems").length);
      }
      if (this.get("checkedItemIds")) {
        this.viewModel.app.idsPreview.set("text", this.get("checkedItemIds").toString());
      }
    }
  });
  _sc.Factories.createComponent("InitControls", model, view, ".sc-multi-select-example");
});