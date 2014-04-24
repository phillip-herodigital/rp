define(["sitecore"], function (_sc) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this.set({
        selectedItemId: ""
      });
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    events: {
      "click .sc-hyperlinkbutton": "select"
    },
    initialize: function (options) {
      this._super();
    },
    select: function (e) {
      var current = $(e.currentTarget);
      this.model.set("selectedItemId", current.closest("li").data("sc-itemId"));
      this.$el.find("[sc-selected]").removeAttr("sc-selected");
      current.closest("li").attr("sc-selected", true);

    }
  });

  _sc.Factories.createComponent("LinksGroup", model, view, ".sc-menu");
});