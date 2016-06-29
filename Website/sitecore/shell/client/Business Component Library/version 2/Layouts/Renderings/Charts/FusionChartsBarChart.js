(function (speak) {
  require.config({
    paths: {
      fusionChartBaseComponent: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Charts/Shared/FusionChartsBaseComponent",
    }
  });

  speak.component(["fusionChartBaseComponent"], function (fusionChartBaseComponent) {

    return speak.extend(fusionChartBaseComponent, {
      initialized: function () {
        try {
          this.initializeFusionChartsBaseComponent();
          this.initializeChart(false);
        } catch (error) {
          console.log(error);
        }
      },

      // Returns the FusionCharts component name
      getChartComponentName: function (chartProperties) {
        if (chartProperties.appearance.stackSeries) {
          return "StackedBar2D";
        }

        switch (chartProperties.dataType) {
          case "MultiSeries":
            return "MSBar2D";
          default:
            return "Bar2D";
        }
      }
    });

  }, "BarChart");
})(Sitecore.Speak);