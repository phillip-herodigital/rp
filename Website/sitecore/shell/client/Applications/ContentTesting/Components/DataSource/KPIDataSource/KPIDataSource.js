define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js"
], function (Sitecore, dataUtil, requestUtil) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();

      this.set("actionUrl", "/sitecore/shell/api/ct/TestResults/GetKPI");
      this.set("isBusy", false);
      this.set("invalidated", false);

      this.set("itemId", null);
      this.set("languageName", null);
      this.set("version", 0);

      this.set("bestExperienceEffect", 0);
      this.set("confidenceLevel", 0);
      this.set("testScore", 0);

      this.on("change:itemId change:languageName change:version", this.refresh, this);

      this.refresh();
    },

    refresh: function () {
      if (this.get("isBusy")) {
        this.set("invalidated", true);
        return;
      }

      var uri = dataUtil.composeUri(this);
      if (!uri) {
        return;
      }

      this.set("isBusy", true);
      this.set("invalidated", false);

      var url = this.get("actionUrl") + "?itemuri=" + encodeURIComponent(uri);

      var ajaxOptions = {
        cache: false,
        url: url,
        context: this,
        dataType: "json",
        success: function(data) {

          this.set("isBusy", false);
          if (this.get("invalidated")) {
            this.refresh();
          } else {
            if (data) {
              // only populate if we're not about to fetch more data to avoid multiple refreshes on screen
              this.set("bestExperienceEffect", data.BestExperienceEffect);
              this.set("confidenceLevel", data.ConfidenceLevel);
              this.set("testScore", data.TestScore);
            }
          }
        },
        error: function(req, status, error) {
          console.log("Ajax call failed");
          console.log(status);
          console.log(error);
          console.log(req);
        }
      };

      requestUtil.performRequest(ajaxOptions);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();

      // stop refreshing while initial settings are read
      this.model.set("isBusy", true);

      this.model.set("itemId", this.$el.attr("data-sc-itemid") || null);
      this.model.set("languageName", this.$el.attr("data-sc-language") || null);
      this.model.set("version", this.$el.attr("data-sc-version") || 0);

      this.model.set("bestExperienceEffect", 0);
      this.model.set("confidenceLevel", 0);

      // settings have completed reading. Resume
      this.model.set("isBusy", false);
      this.model.refresh();
    }
  });

  Sitecore.Factories.createComponent("KPIDataSource", model, view, "script[type='x-sitecore-kpidatasource']");
});
