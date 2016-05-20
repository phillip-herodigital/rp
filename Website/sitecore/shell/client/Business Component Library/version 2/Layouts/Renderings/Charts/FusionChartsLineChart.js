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
        var componentName;

        switch (chartProperties.dataType) {
          case "MultiSeries":
            if (chartProperties.appearance.visibleCategoriesRange) {
              componentName = "ScrollLine2D";
            }
            else {
              componentName = "MSLine";
            }
            break;
          case "MultiAxis":
            componentName = "MultiAxisLine";
            break;
          default:           
              componentName = "Line";            
            break;
        }

        return componentName;
      }
    });

  }, "LineChart");
})(Sitecore.Speak);