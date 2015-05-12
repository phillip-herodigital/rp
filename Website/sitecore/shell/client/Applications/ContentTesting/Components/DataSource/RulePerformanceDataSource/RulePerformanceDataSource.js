define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js"
], function (Sitecore, dataUtil, requestUtil) {
  var actionUrl = "/sitecore/shell/api/ct/PersonalizationRulePerformance/GetRulePerformance";

  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
      this._super();
      this.set("isBusy", false);
      this.set("invalidated", false);
      this.set("ruleSetId", "");
      this.set("ruleId", "");
      this.set("RuleValue", "--");
      this.set("Default", "--");
      this.set("ChangeRate", "--");
      this.set("ChangeValue", "0");
      this.set("RuleVisitors", "0");
      this.set("VisitorsRate", "0");

      this.on("change:ruleSetId change:ruleId", this.fetch, this);
    },
    
    fetch: function () {
      var uri = dataUtil.composeUri(this);
      var ruleSetId = this.get("ruleSetId");
      var ruleId = this.get("ruleId");

      if (!uri || !ruleSetId || !ruleId) {
        return;
      }

      if (this.get("isBusy")) {
        this.set("invalidated", true);
        return;
      }

      this.set("isBusy", true);
      this.set("invalidated", false);

      var self = this;
      var url = Sitecore.Helpers.url.addQueryParameters(actionUrl, {
        itemUri: uri,
        ruleSetId: ruleSetId,
        ruleId: ruleId
      });

      var ajaxOptions = {
        cache: false,
        url: url,
        context: this,
        success: function(data) {
          if (self.get("invalidated")) {
            self.fetch();
          } else {
            self.set("isBusy", false);
            self.set({
              RuleValue: data.RuleValue,
              Default: data.DefaultValue,
              ChangeRate: data.ChangeRate,
              ChangeValue: data.ChangeValue,
              RuleVisitors: data.Visitors,
              VisitorsRate: data.VisitorsRate
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

      // Set initial settings
      this.model.set("itemId", this.$el.attr("data-sc-itemid") || null);
      this.model.set("language", this.$el.attr("data-sc-language") || "");
      this.model.set("version", this.$el.attr("data-sc-version") || 0);
    }
  });

  Sitecore.Factories.createComponent("RulePerformanceDataSource", model, view, ".sc-RulePerformanceDataSource");
});
