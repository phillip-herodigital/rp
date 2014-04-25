require.config({
  paths: {
    chartPalette: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/ChartPalette",
    chartDictionary: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/ChartDictionary",
    chartTemplateProperties: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/ChartTemplateProperties",
    fusionCharts: "/sitecore/shell/client/Speak/Assets/lib/ui/deps/FusionCharts/FusionCharts",
    fusionChartsAdapter: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Charts/Shared/FusionChartsAdapter",
    chartsCss: "../../Business Component Library/Layouts/Renderings/Charts/Shared/Charts"
  }
});

define(["sitecore", "fusionChartsAdapter", "chartPalette", "chartDictionary", "chartTemplateProperties", "fusionCharts", "css!chartsCss"], function (_sc, chartAdapter, chartPalette, chartDictionary) {
  _sc.Factories.createBaseComponent({
    name: "FusionChartsBaseComponent",
    base: "ChartTemplateProperties",
    selector: ".sc-FusionChartsBaseComponent",
    chartsCreated: false,
    initialize: function () {
      this._super();      
    },

    Charting: {
      SelectedSegment: {
        id: null,        
        action: null,
        dataIndex: null,        
        dataObject: null
      }
    },
          
    // Creates the chart with data, and adds it to the webpage
    initializeChart: function (useStandardColors) {
      "use strict";

      var self = this;

      $(window).resize(function () {
        self.setProgressIndicatorPosition();
      });
      
      this.chartId = _.uniqueId("chart_id");
      this.$el.attr("id", this.chartId).css("overflow", "hidden");
      this.model.set("chartControls", []);
      this.model.on("change:data", function () {
        this.toggleProgressIndicator(false);
        
        try {
          this.chartProperties.dataType = this.getDataType(this.chartProperties.dataMapping);
          this.chartProperties.componentName = this.getChartComponentName(this.chartProperties);
          this.setChartData(useStandardColors);
        } catch (e) {
          this.handleError(e);
        }
      }, this);
      
      this.model.set("chartProperties", this.chartProperties);

      FusionCharts.setCurrentRenderer('JavaScript');
      
      this.setProgressIndicatorPosition();
    },

    handleError: function (errorObject) {
      this.model.trigger("error", errorObject);
    },

    // Returns the entire palette depending on dataType
    getChartPalette: function (dataType, data, useStandardColors) {
      "use strict";

      var paletteCreator = {
        multiaxis: function (context, data) {
          return context.getChartPaletteColors(data.axis, "title");
        },
        multiseries: function (context, data) {
          return context.getChartPaletteColors(data.dataset, "seriesname");
        },
        singleseries: function (context) {
          if (useStandardColors) {
            return chartPalette.standardColors.join(",");
          }

          return context.getChartPaletteColor(context.chartProperties.dataMapping.valueChartFields);
        },
        mapping: function (context) {
          return null;
        }
      };

      return paletteCreator[dataType.toLowerCase()](this, data);
    },

    // Returns the palette string
    getChartPaletteColors: function (arr, objectName) {
      "use strict";

      var arrLength = arr.length,
          colorsArray = [];

      for (var i = 0; i < arrLength; i++) {
        var color = this.getChartPaletteColor(arr[i][objectName], i);
        colorsArray.push(color);
      }

      return colorsArray.join(",");
    },

    // Returns a color
    getChartPaletteColor: function (name, index) {
      "use strict";

      index = index || 0;

      switch (name) {
        case "Value":
          return chartPalette.cVa;
        case "Visits":
          return chartPalette.cVi;
        case "ValuePerVisit":
          return chartPalette.cVPV;
        default:
          return chartPalette.standardColors[index];
      }
    },

    // Sets dage and renders the chart
    setChartData: function (useStandardColors) {
      "use strict";

      var self = this,
        data = this.model.get("data");

      if (data) {
        //self.start = new Date().getTime();
        var datasetLength = data.dataset.length,
          i = 0;

        this.chartId = _.uniqueId("chart_id");
        this.$el.attr("id", this.chartId);

        if (datasetLength > 1) {
          this.$el.width("auto").height("auto");
        }

        for (i; i < datasetLength; i += 1) {
          var jsonData = datasetLength > 1 ? this.cloneJsonData(data) : data;
          
          this.createChartControl(i, jsonData, this.chartProperties.appearance.singleChartWidth, this.chartProperties.appearance.singleChartHeight, useStandardColors);
        }

        this.chartsCreated = true;
      }
    },
    
    chartClicked: function(id) {
      self.model.trigger("chartClicked", id);
    },

    setChartEvents: function (chartControl) {
      var self = this;
       
      // see FusionCharts reference http://docs.fusioncharts.com/maps/Contents/javascript/js_event_mouse.html

      var allEvents = [
        //"LegendItemClicked",
        "linkClicked"
      ];

      //var mapsEvents = [
      //  "LegendItemClicked",
      //  "MarkerClicked",
      //  "MarkerRollover",
      //  "MarkerRollout",
      //  "ConnectorClicked",
      //  "ConnectorRollover",
      //  "ConnectorRollout",
      //  "EntityRollover",
      //  "EntityRollout"
      //];

      $.each(allEvents, function (index, value) {
        chartControl.addEventListener(value, function () {
          self.Charting.SelectedSegment = JSON.parse(JSON.stringify(_sc.Charting.SelectedSegment));
          self.model.trigger("segmentClicked");
        });
      });     
    },
        
    // clone the Json data in order to be able to use it for multiple
    cloneJsonData: function(jsonData) {
      return JSON.parse(JSON.stringify(jsonData));
    },

    // Creates the chart control, sets the data, and render it to the page
    createChartControl: function (datasetIndex, jsonData, chartWidth, chartHeight, useStandardColors) {
      var self = this,
        chartId = _.uniqueId("chart_id"),
        chartContainer = $("<div />").attr("id", chartId).addClass("sc-charts-pull-left"),
        data = null;

      if (!this.chartsCreated) {
        chartContainer.width(chartWidth).height(chartHeight);
        chartContainer.appendTo(this.$el);
      }
      
      var chartControl = null;
      var chartControls = this.model.get("chartControls");
      
      if (!this.chartsCreated) {
         chartControl = new FusionCharts("/sitecore/shell/client/SpeakCharting/Assets/lib/deps/FusionCharts/" + this.chartProperties.componentName, this.chartProperties.componentName + chartId, "100%", "100%", "0");
        
        chartControls.push(chartControl);
      } else {
        chartControl = chartControls[datasetIndex];       
      }

      if (!this.chartsCreated) {
        this.setChartEvents(chartControl);
      }

      this.setChartControls(chartControls);      
      
      try {
        data = chartAdapter.convert(datasetIndex, this.chartProperties.dataType, jsonData, this.chartProperties.dataMapping, 10);
        if (data) {
          chartControl.setJSONData(data);
          this.setChartAttributes(data, useStandardColors, chartControl);
        }
      } catch(error) {
        this.handleError(error);
      } finally {
        chartControl.configure({
          "ChartNoDataText": chartDictionary["No data to display"],
          "LoadDataErrorText": "",
          "ParsingDataText": "",
          "RenderingChartText": "",
          "RetrievingDataText": "",        
        });

        if (!this.chartsCreated) {
          chartControl.render(chartId);
        }
        this.model.set("convertedData", data);
      }
    },
  
    setChartControls: function (chartControls) {
      this.model.set("chartControls", chartControls);
      this.model.trigger("change:chartControls");
    },
    
    // Sets the attributes for the Fusion Chart rendering
    setChartAttributes: function (data, useStandardColors, chartControl) {
      "use strict";
      this.setDefaultChartAttributes(data, useStandardColors, chartControl);
    },
    

    // Sets the attributes for the Fusion Chart rendering
    setDefaultChartAttributes: function (data, useStandardColors, chartControl) {
      "use strict";

      var scrollingCharts = ["ScrollColumn2D", "ScrollLine2D", "ScrollArea2D", "ScrollStackedColumn2D", "ScrollCombi2D", "ScrollCombiDY2D"];

      chartControl.setChartAttribute({
        // DEFAULTS

        "connectNullData": "1",
        "showalternatehgridcolor": "1",
        "alternatehgridcolor": "fcfcfc",
        "zeroPlaneAlpha": "100",
        "zeroPlaneThickness": "1",
        "allowSelection": "0",

        "formatNumber": "1",
        "decimals": 2,

        "canvasBorderThickness": "1",
        "canvasbordercolor": "666666",
        "showShadow": 0,
        "use3DLighting": 0,
        "bgAlpha": 0,
        "showBorder": 0,
        "drawanchors": "0",

        "canvasbgratio": "1",
        "animation": "0",

        "labeldisplay": "ROTATE",
        "slantLabels": "1",
        "lineThickness": 2,
        "labelDisplay": "AUTO",
        "canvaspadding": "20",
        "plotGradientColor": "",
        
        "xaxisname": this.chartProperties.dataMapping.categoryChartField.headerText,
        "yaxisname": this.chartProperties.dataMapping.valueChartFields.length > 1 ? null : this.chartProperties.dataMapping.valueChartFields[0].headerText,

        "palettecolors": this.getChartPalette(this.chartProperties.dataType, data, useStandardColors),

        // Sitecore properties
        "showValues": this.chartProperties.appearance.showValues,
        "showLegend": this.chartProperties.appearance.showLegend,

        //showAxis hide labes, Yvalues, border
        "showplotborder": this.chartProperties.appearance.showAxis,
        "showyaxisvalues": this.chartProperties.appearance.showAxis,
        "showLabels": this.chartProperties.appearance.showAxis,
        "canvasborderalpha": this.chartProperties.appearance.showAxis ? 100 : 0,
        "divLineAlpha": this.chartProperties.appearance.showAxis ? 100 : 0
      });

      // Scrolling chart for multiseries
      if (scrollingCharts.indexOf(this.chartProperties.componentName) !== -1) {
        chartControl.setChartAttribute({
          "numVisiblePlot": this.chartProperties.appearance.visibleCategoriesRange
        });

        if (this.chartProperties.dataType === "SingleSeries" || this.chartProperties.dataType === "MultiSeries" || this.chartProperties.dataType === "Mapping") {
          var valueChartField = this.chartProperties.dataMapping.valueChartFields[0];

          this.setChartAffixes(valueChartField, chartControl);
          this.setChartNumberScale(valueChartField, chartControl);
          this.setChartSeparators(valueChartField, chartControl);
        }
      }
    },
    
    // Set prefix and suffix for the chart
    setChartAffixes: function (valueChartField, chartControl) {
      var prefix = valueChartField.prefix,
          suffix = valueChartField.suffix;

      if (suffix) {
        chartControl.setChartAttribute("numbersuffix", suffix);
      }

      if (prefix) {
        chartControl.setChartAttribute("numberprefix", prefix);
      }
    },
    
    // Sets the number scale values and units for the chart
    setChartNumberScale: function (valueChartField, chartControl) {
      if (valueChartField.numberScale) { 
        var scaleValue = valueChartField.numberScale.scaleValue,
          scaleUnit = valueChartField.numberScale.scaleUnit;
      
        if (scaleValue) {
          chartControl.setChartAttribute("numberScaleValue", scaleValue.replace(/"/g, ""));
        }

        if (scaleUnit) {
          chartControl.setChartAttribute("numberScaleUnit", scaleUnit.replace(/"/g, ""));
        }
      
        if (scaleValue || scaleUnit) {
          chartControl.setChartAttribute("scaleRecursively", 1);
        }
      }
    },
    
    // Sets the chart separators for the chart
    setChartSeparators: function (valueChartField, chartControl) {
      chartControl.setChartAttribute("decimalSeparator", valueChartField.decimalSeparator);
      chartControl.setChartAttribute("thousandSeparator", valueChartField.thousandSeparator);
    },
    
    setProgressIndicatorPosition: function (pi) {
      if (!pi) {
        pi = $('[data-sc-id="' + this.$el.attr("data-sc-id") + 'ProgressIndicator"]');
      }
      
      if (pi) {
        pi.width(this.$el.outerWidth() + "px");
        pi.height(this.$el.outerHeight() + "px");
        pi.css({
          top: this.$el.offset().top + "px",
          left: this.$el.offset().left + "px",
          position: "absolute"
        });
      }
      
    },

    toggleProgressIndicator: function (status) {
      var pi = $('[data-sc-id="' + this.$el.attr("data-sc-id") + 'ProgressIndicator"]');
      if (status) {
        this.setProgressIndicatorPosition(pi);
      }
      
      if (pi) {
        pi.toggle(status);
      }
    }
    
  });
});