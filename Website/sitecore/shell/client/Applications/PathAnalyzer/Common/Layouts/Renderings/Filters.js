define(["sitecore", "knockout"], function (_sc, ko) {
  var model = _sc.Definitions.Models.ControlModel.extend({
    initialize: function () {
    
    }
  });

  var view = _sc.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();
    }
  });

  _sc.Factories.createComponent("FilterControl", model, view, ".sc-filtercontrol");
});