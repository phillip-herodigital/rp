﻿
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
      getChartComponentName: function(chartProperties) {
        var componentName;

        switch (chartProperties.dataType) {
        case "MultiSeries":
          if (chartProperties.appearance.stackSeries && chartProperties.appearance.visibleCategoriesRange) {
            componentName = "ScrollStackedColumn2D";
          } else if (chartProperties.appearance.visibleCategoriesRange) {
            componentName = "ScrollColumn2D";
          } else if (chartProperties.appearance.stackSeries) {
            componentName = "StackedColumn2D";
          } else {
            componentName = "MSColumn2D";
          }
          break;
        default:
          componentName = "Column2D";
          break;
        }
        return componentName;
      }
    });
  }, "ColumnChart");
})(Sitecore.Speak);


