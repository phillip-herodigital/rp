define(["sitecore", "jquery"], function (_sc, $) {
    var model = _sc.Definitions.Models.ControlModel.extend({
        initialize: function () {

        }
    });

    var view = _sc.Definitions.Views.ControlView.extend({
        initialize: function () {
            this._super();
        }
    });

    _sc.Factories.createComponent("LegendControl", model, view, ".sc-legend");
});