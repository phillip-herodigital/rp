define(["sitecore"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      this.set("isAdministrator", false);
      this.set("isECMUsers", false);
      this.set("isECMAdvancedUsers", false);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();

      this.model.set("isAdministrator", this.$el.data("sc-isadministrator"));
      this.model.set("isECMUsers", this.$el.data("sc-isecmusers"));
      this.model.set("isECMAdvancedUsers", this.$el.data("sc-isecmadvancedusers"));
    }
  });

  Sitecore.Factories.createComponent("AccountInformationExt", model, view, ".sc-AccountInformationExt");
});
