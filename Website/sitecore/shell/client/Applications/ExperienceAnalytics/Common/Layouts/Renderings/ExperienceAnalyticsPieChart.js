require.config({
  paths: {
    experienceAnalyticsChartBase: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalyticsChartBase"
  }
});

define(["sitecore", "experienceAnalyticsChartBase"], function (Sitecore, experienceAnalyticsChartBase) {
    Sitecore.Factories.createBaseComponent({
        name: "ExperienceAnalyticsPieChart",
        base: "ExperienceAnalyticsChartBase",
        selector: ".sc-ExperienceAnalyticsPieChart",
        attributes: Sitecore.Definitions.Views.ExperienceAnalyticsChartBase.prototype._scAttrs.concat([
            { name: "chartName", value: "PieChart" },
            { name: "targetPageUrl", value: "$el.data:sc-targetpageurl" }
        ]),

        chartModel: null,
        keyProperty: "key",
        rawKeys: {},

        initialize: function() {
            this._super();

            this.model.setPreferredTimeResolution("-");
        },

        afterRender: function () {
          this.chartModel = this.app[this.model.get("name") + this.model.get("chartName")];
          this.setupMessageBar(this.chartModel);
          this.setChartProperties(this.chartModel);
          var chartModel = this.chartModel;

          chartModel.attributes.chartProperties.appearance.enableAnimation = false;

          chartModel.on("change:chartControls", function () {
            chartModel.off("change:chartControls");
            chartModel.get("chartControls")[0].addEventListener("Rendered", function () {
              chartModel.get("chartControls")[0].setChartAttribute("enableRotation", 0);
            });
          });

          if (this.model.get("targetPageUrl")) {
            chartModel.attributes.chartProperties.appearance.disableSelection = false;
            this.chartModel.on("segmentSelected", this.model.viewModel.drillDownToKey, this);
          }
        },

        setChartFieldProperties: function (data) {
            var chartProperties = this.chartModel.get("chartProperties"),
                seriesChartField = this.model.get("seriesChartField");

            if (this.useCartesianKey(data)) {
                    chartProperties.dataMapping.categoryChartField = {
                        dataField: seriesChartField.cartesianKeyField
                    };
                }
        },

        setKeyTranslations: function (readyData) {
            var entries = readyData.dataset[0].data,
                seriesChartField = this.model.get("seriesChartField"),
                keyTranslations = this.getTranslationsByField(readyData, seriesChartField.keyField);

            for (var k = 0; k< entries.length; k++) {
              var entryVal = entries[k];
              this.rawKeys[k] = entryVal[this.keyProperty];
              entryVal.itemId = k;
            }

            if (!this.useCartesianKey(readyData)) {
                for (var i = 0; i < entries.length; i++) {
                    if (keyTranslations[entries[i].key] !== undefined)
                        entries[i].key = keyTranslations[entries[i].key]; // Fix translation which doesn't work for category labels in SPEAK charting.
                }
            } else {
                var segmentTranslations = this.getTranslationsByField(readyData, seriesChartField.segmentField);

                for (var j = 0; j < entries.length; j++) {
                    var entry = entries[j];

                    if (keyTranslations[entry[seriesChartField.keyField]] !== undefined)
                        entry.cartesianKey = segmentTranslations[entry[seriesChartField.segmentField]] + " - " + keyTranslations[entry[seriesChartField.keyField]];
                }
            }

            return readyData;
        }
    });

});