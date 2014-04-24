require.config({
  paths: {
    chartDictionary: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/Dictionaries/ChartDictionary"
  }
});

define(["sitecore", "chartDictionary"], function (_sc, chartDictionary) {
  _sc.Factories.createBaseComponent({
    name: "ChartTemplateProperties",
    base: "BlockBase",
    selector: ".sc-ChartTemplate",
    initialize: function () {
      this.chartProperties = {
        appearance: {
          showValues: this.$el.data("sc-showvalues"),
          showLegend: this.$el.data("sc-showlegend"),
          showAxis: this.$el.data("sc-showaxis"),
          singleChartHeight: this.$el.data("sc-singlechartheight"),
          singleChartWidth: this.$el.data("sc-singlechartwidth"),
          visibleCategoriesRange: this.$el.data("sc-visiblecategoriesrange"),
          stackSeries: this.$el.data("sc-stackseries")
        },
        dataMapping: {
          categoryChartField: this.$el.data("sc-categorychartfield"),
          categoryFilter: this.$el.data("sc-categoryfilter"),
          valueChartFields: this.$el.data("sc-valuechartfields"),
          seriesChartField: this.$el.data("sc-serieschartfield") || {},
          seriesFilter: this.$el.data("sc-seriesfilter"),
          regionAlias: this.$el.data("sc-regionalias")
        },
        dataType: null,
        componentName: null
      };
    },

    // Returns the FusionCharts component name
    // This function is overridden in each single Chart component
    getChartComponentName: function () {
      throw { name: "Error", message: chartDictionary["GetChartComponentName is not overridden"] };
    },

    getDataType: function (dataMapping) {
      if (!dataMapping.categoryChartField.dataField) {
        throw { name: "Error", message: chartDictionary["CategoryChartField not defined"] };
      }

      if (!dataMapping.valueChartFields.length) {
        throw { name: "Error", message: chartDictionary["ValueChartFields not defined"] };
      }

      if (dataMapping.regionAlias) {
        return "Mapping";
      }

      var valueColumsCount = dataMapping.valueChartFields.length;

      if (valueColumsCount > 1) {
        return "MultiAxis";
      }

      if (!dataMapping.seriesChartField.dataField) {
        return "SingleSeries";
      }

      return "MultiSeries";
    }
  });
});