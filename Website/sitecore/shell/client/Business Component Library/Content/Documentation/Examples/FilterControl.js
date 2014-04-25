define(["sitecore"], function (_sc) {
  var model = Sitecore.Definitions.Models.ControlModel;
  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();
      if (this.app && this.app.FilterControl2) {
        this.app.FilterControl2.set('facets', facets);
        this.app.FilterControl2.on("change:selectedFacets", this.changedFacetsToString);
      }
    },
    changedFacetsToString: function () {
      var selected = this.get("selectedFacets");
      this.viewModel.app.Text1.set("text", JSON.stringify(selected));
    }
  });
  _sc.Factories.createComponent("InitControls", model, view, ".sc-init-controls");
});