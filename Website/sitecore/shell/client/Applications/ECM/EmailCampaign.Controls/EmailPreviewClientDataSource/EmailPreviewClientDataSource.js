define(["sitecore"], function (sitecore) {
  "use strict";

  var model = sitecore.Definitions.Models.ComponentModel.extend(
    {
      initialize: function () {
        this._super();
        this.set("data", "");
      }
    }
  );

  var view = sitecore.Definitions.Views.ComponentView.extend(
    {
      initialize: function () {
        this._super();
        this.model.set("data", $.parseJSON(this.$el.attr("data-sc-data")));
      }
    }
  );

  sitecore.Factories.createComponent("EmailPreviewClientDataSource", model, view, "script[type='text/x-sitecore-ecm-emailpreviewclientdatasource']");
});