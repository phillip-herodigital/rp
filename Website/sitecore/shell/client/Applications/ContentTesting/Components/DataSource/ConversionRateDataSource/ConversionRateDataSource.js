define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js"
], function (Sitecore, dataUtil, requestUtil) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this._super();

      this.set("actionUrl", "/sitecore/shell/api/ct/TestResults/GetConversionRate");

      this.set("itemId", null);
      this.set("languageName", "");
      this.set("version", 0);
      this.set("pageSize", 50);
      this.set("goalId", null);
      this.set("isBusy", false);
      this.set("invalidated", false);
      this.set("hasMore", false); // is this required if items is not used?
      this.set("items", []); // is this used?

      this.set("conversions", 0);
      this.set("conversionRate", 0);
      this.set("totalResults", 0); // is this required if items is not used?
      this.set("resultCount", 0); // is this required if items is not used?

      this.on("change:itemId change:languageName change:version change:pageSize change:goalId", this.reset, this);
    },
    
    reset: function()
    {
      this.set("count", 0);
      this.fetch();
    },

    fetch: function () {
      this.getCount();
      var count = this.get("count");
      var goalId = this.get("goalId");

      if (!goalId || !count) {
        return;
      }

      var uri = dataUtil.composeUri(this);
      if (!uri) {
        return;
      }

      if (this.get("isBusy")) {
        this.set("invalidated", true);
        return;
      }

      this.set("isBusy", true);
      this.set("invalidated", false);

      var url = this.get("actionUrl") + "?itemuri=" + encodeURIComponent(uri) + "&goalId=" + goalId + "&resultCount=" + count;

      var ajaxOptions = {
        cache: false,
        url: url,
        headers: { },
        context: this,
        success: function(data) {
          this.set("isBusy", false);
          if (this.get("invalidated")) {
            this.fetch();
          } else {
            this.set({
              conversions: data.Conversions,
              conversionRate: data.ConversionRate,
              items: data.Items,
              totalResults: data.TotalResults,
              hasMore: data.Items[0].items.length < data.TotalResults,
              resultCount: this.get("pageSize")
            });
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
    },

    getCount: function () {
      var count = this.get("count");

      // If 'count' hasn't been initialized yet, use default size value
      if (count === undefined || count === 0) {
        var defaultSize = this.get("defaultSize");
        this.set("count", defaultSize);
        return;
      }

      // Increase number of items to retrieve to page size value
      count = parseInt(count, 10) + parseInt(this.get("pageSize"), 10);
      this.set("count", count);
    }
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();

      // Set initial settings
      this.model.set("itemId", this.$el.attr("data-sc-itemid") || null);
      this.model.set("language", this.$el.attr("data-sc-language") || "");
      this.model.set("version", this.$el.attr("data-sc-version") || 0);
      this.model.set("goalId", this.$el.attr("data-sc-goalId") || null);

      this.model.set("defaultSize", this.$el.attr("data-sc-defaultsize") || 5);
      this.model.set("pageSize", this.$el.attr("data-sc-pagesize") || 5);
    }
  });

  Sitecore.Factories.createComponent("ConversionRateDataSource", model, view, ".sc-ConversionRateDataSource");
});


