require.config({
  paths: {
    experienceAnalyticsChartBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalyticsChartBase"
  }
});

define(["sitecore", "experienceAnalyticsChartBase"], function (Sitecore, experienceAnalyticsChartBase) {

  Sitecore.Factories.createBaseComponent({
    name: "ExperienceAnalyticsLineChart",
    base: "ExperienceAnalyticsChartBase",
    selector: ".sc-ExperienceAnalyticsLineChart",
    attributes: Sitecore.Definitions.Views.ExperienceAnalyticsChartBase.prototype._scAttrs.concat([
      { name: "chartName", value: "LineChart" }
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

