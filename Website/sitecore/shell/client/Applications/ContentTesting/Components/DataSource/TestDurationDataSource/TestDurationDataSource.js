define([
    "sitecore",
    "/-/speak/v1/contenttesting/RequestUtil.js"],
  function (Sitecore, requestUtil) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();

      var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);

      this.set({
        actionUrl: "/sitecore/shell/api/ct/TestVariables/GetExpectedTestDuration",
        actionUrlForPageTest: "/sitecore/shell/api/ct/TestVariables/GetExpectedTestDurationForPageTest",
        isBusy: false,
        invalidated: false,
        itemUri: null,
        device: params.device || null,
        additionalPageCount: null,
        trafficAllocation: 0,
        confidence: 0,
        disabledVariables: [],
        variableCount: 0,
        valueCount: 0,
        experienceCount: 0,
        viewsPerDay: 0,
        requiredVisits: 0,
        expectedDays: 0,
        isEstimated: false
      });

      this.on("change:itemUri change:additionalPageCount change:trafficAllocation change:disabledVariables change:confidence", this.refresh, this);
    },

    composeUri: function () {
      var params = Sitecore.Helpers.url.getQueryParameters(window.location.href);
      return encodeURIComponent(this.get("itemUri") || params.uri);
    },

    refresh: function () {
      if (this.get("isBusy")) {
        this.set("invalidated", true);
        return;
      }

      this.set("isBusy", true);
      this.set("invalidated", false);

      var url = "";

      if (this.get("additionalPageCount") !== null) {
        var additionalPageCount = this.get("additionalPageCount") || 0;
        url = this.get("actionUrlForPageTest") + "?additionalPageCount=" + additionalPageCount;
      }
      else {
        var disabledVariantIds = "?";
        var disabledVariants = this.get("disabledVariables");

        for (var i in disabledVariants) {
          disabledVariantIds += "&disabledVariants=" + disabledVariants[i].UId;
        }

        url = this.get("actionUrl") + disabledVariantIds;
      }

      url +=
        "&itemuri=" + this.composeUri() +
        "&trafficAllocationPercentage=" + (this.get("trafficAllocation") || "") +
        "&confidencePercentage=" + (this.get("confidence") || "") +
        "&deviceId=" + (this.get("device") || "");

      var ajaxOptions = {
        cache: false,
        url: url,
        context: this,
        success: function(data) {
          this.set("isBusy", false);
          if (this.get("invalidated")) {
            this.refresh();
          } else {
            this.set({
              variableCount: data.VariableCount,
              valueCount: data.ValueCount,
              experienceCount: data.ExperienceCount,
              viewsPerDay: data.ViewsPerDay,
              expectedDays: data.ExpectedDays,
              isEstimated: data.IsEstimated,
              requiredVisits: data.RequiredVisits,
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

      // stop refreshing while initial settings are read
      this.model.set("isBusy", true);

      this.model.set("itemUri", this.$el.attr("data-sc-itemuri") || null);
      this.model.set("trafficAllocation", this.$el.attr("data-sc-trafficallocation") || 100);
      this.model.set("confidence", this.$el.attr("data-sc-confidence") || 90);
      this.model.set("disabledVariables", this.$el.attr("data-sc-disabledvariables") || []);

      // settings have completed reading. Resume
      this.model.set("isBusy", false);
      this.model.refresh();
    }
  });

  Sitecore.Factories.createComponent("TestDurationDataSource", model, view, "script[type='x-sitecore-testdurationdatasource']");
});
