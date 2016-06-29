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
          this.initializeChart(true);
          this.allowsDeselection = true;
        } catch (error) {
          console.log(error);
        }
      },

      // Returns the FusionCharts component name      
      getChartComponentName: function () {
        return "Doughnut2D";
      }
    });

  }, "DoughnutChart");
})(Sitecore.Speak);
