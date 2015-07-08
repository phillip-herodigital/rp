define(["sitecore"], function(sitecore) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function() {
      this._super();
    }
  });

  var view = sitecore.Definitions.Views.ControlView.extend({
    initialize: function() {
      this._super();
    }
  });

  sitecore.Factories.createComponent("MessageOverview", model, view, ".sc-MessageOverview");
});