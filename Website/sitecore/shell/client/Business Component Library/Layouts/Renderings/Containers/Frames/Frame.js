/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {

  var model = _sc.Definitions.Models.BlockModel.extend(
    {
      initialize: function (options)
      {
        this._super();
      }
    });

    var view = _sc.Definitions.Views.BlockView.extend(
    {
      initialize: function()
      {
          this._super();
          this.model.set("isDeferred", this.$el.data("sc-isDeferred"));
          this.model.on("change:sourceUrl", function () {
              this.$el.attr("src", this.model.get("sourceUrl"));
          }, this);
      },
      afterRender: function () {
          if (this.model.get("isDeferred")) {
              this.model.set("sourceUrl", this.$el.attr("sc-sourceUrl"));
          }
      }
    });

  _sc.Factories.createComponent("Frame", model, view, ".sc-frame");
});