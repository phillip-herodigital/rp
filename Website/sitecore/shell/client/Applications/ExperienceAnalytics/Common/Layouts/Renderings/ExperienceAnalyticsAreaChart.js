require.config({
  paths: {
    experienceAnalyticsChartBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalyticsChartBase"
  }
});

define(["sitecore", "experienceAnalyticsChartBase"], function (Sitecore, experienceAnalyticsChartBase) {

  Sitecore.Factories.createBaseComponent({
    name: "ExperienceAnalyticsAreaChart",
    base: "ExperienceAnalyticsChartBase",
    selector: ".sc-ExperienceAnalyticsAreaChart",

    attributes: Sitecore.Definitions.Views.ExperienceAnalyticsChartBase.prototype._scAttrs.concat([
      { name: "chartName", value: "AreaChart" }
    ]),

    initialize: function () {
      this._super();
    },

    afterRender: function () {
      var chartModel = this.app[this.model.get("name") + this.model.get("chartName")];
      this.chartModel = chartModel;
      this.setupMessageBar(chartModel);
      this.setChartProperties(chartModel);
    }
  });

});