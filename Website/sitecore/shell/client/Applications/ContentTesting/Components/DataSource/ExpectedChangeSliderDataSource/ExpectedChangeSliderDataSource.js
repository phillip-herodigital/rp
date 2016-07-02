define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js"
], function (Sitecore, dataUtil, requestUtil) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      this.set("actionUrl", "/sitecore/shell/api/ct/CreateTestDialog/GetExpectedChangesSliderItems");

      this.set("sourceItem", null);
      this.set("contentLanguage", null);
      this.set("isBusy", false);
      this.set("items", []);
    },

    refresh: function () {
      // do not allow multiple refreshes to run at once
      if (this.get("isBusy"))
        return;

      this.set("items", []);
      this.fetch();
    },

    fetch: function () {
      // do not allow multiple fetches to run at once
      if (this.get("isBusy"))
        return;

      var sourceItem = this.get("sourceItem");
      var contentLanguage = this.get("contentLanguage");

      this.set("isBusy", true);

      var url = this.get("actionUrl") + "?sourceItem=" + sourceItem;

      if (contentLanguage != null) {
        url += "&scLanguage=" + contentLanguage;
      }

      var ajaxOptions = {
        cache: false,
        url: url,
        context: this,
        success: function(data) {
          this.set("isBusy", false);
          if (this.get("invalidated")) {
            this.fetch();
          } else {
            this.set({
              items: data,
            });
          }
        }
      };

      requestUtil.performRequest(ajaxOptions);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
      this._super();

      this.model.set("isBusy", false);
      this.model.set("sourceItem", this.$el.attr("data-sc-sourceitem"));
      this.model.set("contentLanguage", this.$el.attr("data-sc-contentLanguage"));
      
      this.model.refresh();
    }
  });

  Sitecore.Factories.createComponent("ExpectedChangeSliderDataSource", model, view, "script[type='x-sitecore-expectedchangesliderdatasource']");
});
