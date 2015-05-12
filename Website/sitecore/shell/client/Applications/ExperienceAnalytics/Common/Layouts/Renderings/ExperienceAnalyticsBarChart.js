require.config({
  paths: {
    experienceAnalyticsChartBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalyticsChartBase"
  }
});

define(["sitecore", "experienceAnalyticsChartBase"], function (Sitecore, experienceAnalyticsChartBase) {
  Sitecore.Factories.createBaseComponent({
    name: "ExperienceAnalyticsBarChart",
    base: "ExperienceAnalyticsChartBase",
    selector: ".sc-ExperienceAnalyticsBarChart",
    attributes: Sitecore.Definitions.Views.ExperienceAnalyticsChartBase.prototype._scAttrs.concat([
      { name: "chartName", value: "BarChart" }
    ]),

    initialize: function () {
      this._super();

      this.model.setTimeResolution("-");
    },

    afterRender: function () {
      var chartModel = this.app[this.model.get("name") + this.model.get("chartName")];
      this.chartModel = chartModel;
      this.setupMessageBar(chartModel);
      this.setChartProperties(chartModel);
    },

    setChartData: function (data) {
      var chartProperties = this.chartModel.get("chartProperties"),
        seriesChartField = this.model.get("seriesChartField");

      if (this.model.get("keyGrouping") === "collapsed") {
        data = this.renameSumKeys(data);
      }

      var entries = data.dataset[0].data,
        keyTranslations = this.getTranslationsByField(data, seriesChartField.keyField);

      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        if (keyTranslations[entry.key] !== undefined)
          entry.key = keyTranslations[entry.key]; // Fix translation which doesn't work for category labels in SPEAK charting.
      }

      chartProperties.dataMapping.seriesChartField = {
        dataField: seriesChartField.segmentField
      };

      this.chartModel.set("data", data);
    }
  });

});