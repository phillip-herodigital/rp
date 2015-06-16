define(["sitecore"], function (sitecore) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();
    }
  });

  var view = sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();
    }
  });

  sitecore.Factories.createComponent("DesignImporter", model, view, ".sc-DesignImporter");
});
