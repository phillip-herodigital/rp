define(["sitecore"], function (sitecore) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();

      this.set("isExpanded", false);
      }
  });

  var view = sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();

      this.model.on("change:isExpanded", function () {
        sitecore.trigger((this.model.get("isExpanded") ? "more" : "less") + ":" + this.$el.attr("data-sc-id"));
      }, this);

      if (this.model.get("isExpanded")) {
        this.$el.children(".sc-expander-ecm-body").show();
      } else {
        this.$el.children(".sc-expander-ecm-body").hide();
      }
    },

    toggleExpanded: function () {
      this.model.set("isExpanded", !this.model.get("isExpanded"));
      this.$el.children(".sc-expander-ecm-body").toggle(250);
    },
  });

  sitecore.Factories.createComponent("EcmExpander", model, view, ".sc-expander-ecm");
});
