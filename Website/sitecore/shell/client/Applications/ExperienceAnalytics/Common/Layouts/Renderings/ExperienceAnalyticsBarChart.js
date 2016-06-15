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
      { name: "chartName", value: "BarChart" },
      { name: "targetPageUrl", value: "$el.data:sc-targetpageurl" }
    ]),

    chartModel: null,

    initialize: function () {
      this._super();

      this.model.setPreferredTimeResolution("-");
    },

    afterRender: function () {
      this.chartModel = this.app[this.model.get("name") + this.model.get("chartName")];
      this.setupMessageBar(this.chartModel);
      this.setChartProperties(this.chartModel);
      this.model.get("targetPageUrl") ?
        this.chartModel.attributes.chartProperties.appearance.disableSelection = false : $.noop();
      this.chartModel.off("segmentClicked").on("segmentClicked", this.model.viewModel.drillDownToKey, this);
    },

    setChartFieldProperties: function () {
      var chartProperties = this.chartModel.get("chartProperties"),
        seriesChartField = this.model.get("seriesChartField");

        chartProperties.dataMapping.seriesChartField = {
            dataField: seriesChartField.segmentField
        };
    },

    setKeyTranslations: function(readyData) {
          var entries = readyData.dataset[0].data,
              seriesChartField = this.model.get("seriesChartField"),
              keyTranslations = this.getTranslationsByField(readyData, seriesChartField.keyField);

      for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        this.rawKeys[i] = entry[this.keyProperty];
        entry.itemId = i;
        if (keyTranslations[entry.key] !== undefined)
          entry.key = keyTranslations[entry.key]; // Fix translation which doesn't work for category labels in SPEAK charting.
      }

          return readyData;
    }
  });

});