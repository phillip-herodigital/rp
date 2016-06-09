describe("Given a ColumnChart component", function () {
  var sutColumnChart = Sitecore.Speak.app.ColumnChart;
  var data = {
    "localization": {
      "fields": [
        {
          "field": "channel",
          "translations": {
            "10": "Search Engine Organic",
            "15": "Search Engine Organic Branded",
            "20": "Direct",
            "30": "Referred-Other",
            "31": "Referred-Blog",
            "32": "Referred-News",
            "33": "Referred-Conversations",
            "34": "Referred-Community",
            "35": "Referred-Wiki",
            "36": "Referred-Analyst",
            "40": "RSS",
            "50": "Email",
            "90": "Paid"
          }
        }
      ]
    },
    "dataset": [
      {
        "data": [
          {
            "date": "01 Jan 2011",
            "value": "1",
            "visits": "11",
            "valuePerVisit": "0.09",
            "channel": "10"
          },
          {
            "date": "10 Jan 2011",
            "value": "2",
            "visits": "12",
            "valuePerVisit": "0.16",
            "channel": "50"
          },
          {
            "date": "20 Jan 2011",
            "value": "3",
            "visits": "13",
            "valuePerVisit": "0.23",
            "channel": "20"
          },
          {
            "date": "30 Jan 2011",
            "value": "4",
            "visits": "14",
            "valuePerVisit": "0.28",
            "channel": "10"
          }
        ]
      }
    ]
  };


  it("should exists", function () {
    expect(sutColumnChart).toBeDefined();
  });

  describe("Given a ColumnChart", function () {    
    $sutEl = $(sutColumnChart.el);

    it("it should have a DynamicData property", function () {
      expect(sutColumnChart.DynamicData).toBeDefined();
    });

    it("it should have a CategoryFilter property", function () {
      expect(sutColumnChart.CategoryFilter).toBeDefined();
    });

    it("it should have a ShowLegend property", function () {
      expect(sutColumnChart.ShowLegend).toBeDefined();
    });
    it("it should have a ShowValues property", function () {
      expect(sutColumnChart.ShowValues).toBeDefined();
    });
    it("it should have a SingleChartHeight property", function () {
      expect(sutColumnChart.SingleChartHeight).toBeDefined();
    });
    it("it should have a EnableAnimation property", function () {
      expect(sutColumnChart.EnableAnimation).toBeDefined();
    });
    it("it should have a DisableSelection property", function () {
      expect(sutColumnChart.DisableSelection).toBeDefined();
    });
    it("it should have a EnableAnimation property", function () {
      expect(sutColumnChart.EnableAnimation).toBeDefined();
    });
    
    it("it should have a ShowPointMarker property", function () {
      expect(sutColumnChart.ShowPointMarker).toBeDefined();
    });
    // Axis
    it("it should have a ShowAxis property", function () {
      expect(sutColumnChart.ShowAxis).toBeDefined();
    });
    // MultiSeries
    it("it should have a SeriesFilter property", function () {
      expect(sutColumnChart.SeriesFilter).toBeDefined();
    });
    //Scrolling
    it("it should have a VisibleCategoriesRange property", function () {
      expect(sutColumnChart.VisibleCategoriesRange).toBeDefined();
    });
    // Stacking
    it("it should have a StackSeries property", function () {
      expect(sutColumnChart.StackSeries).toBeDefined();
    });  
    // Client only properties
    it("it should have a NoDataToDisplay property", function () {
      expect(sutColumnChart.NoDataToDisplay).toBeDefined();
    });    
    it("it should have a PropertyNotDefined property", function () {
      expect(sutColumnChart.PropertyNotDefined).toBeDefined();
    });    
      
    it("it should have a ChartProperties property", function () {
      expect(sutColumnChart.chartProperties).toBeDefined();
    });    
  });

  describe("Given a ColumnChart Control", function () {
    $sutEl = $(sutColumnChart.el);

    it("it should create the Control when I execute Run", function () {
      expect(sutColumnChart).toBeDefined();       
    
    });

    it("it should not appear when I set the isVisible property", function () {
      var value = false; 
      expect($sutEl.is(":visible")).toEqual(!value);
      sutColumnChart.IsVisible = value;
      expect(sutColumnChart.IsVisible).toEqual(value);
      expect($sutEl.is(":visible")).toEqual(value);
    });

    it("it should be disabled when I set the isEnabled property to false", function () {
      var value = false;
      expect($sutEl.is(":disabled")).toEqual(value);
      sutColumnChart.IsEnabled = value;
      expect(sutColumnChart.IsEnabled).toEqual(value);
      expect($sutEl.is(":disabled")).toEqual(value);
    });
      
    describe("it should have a getChartComponentName property", function () {
      it("to be defined as a function", function () {
        expect(sutColumnChart.getChartComponentName).toBeDefined();
        expect(typeof sutColumnChart.getChartComponentName).toBe("function");
      });

      var chartProperties = {
        appearance: {
          stackSeries: false,
          visibleCategoriesRange: null
        },
        dataType: ""
      };

      it("when dataType is 'SingleSeries' it returns 'Column2D'", function () {
        chartProperties.dataType = "SingleSeries";
        expect(sutColumnChart.getChartComponentName(chartProperties)).toBe("Column2D");
      });

      describe("when dataType is 'MultiSeries'", function () {
        it("it returns 'MSColumn2D'", function () {
          chartProperties.dataType = "MultiSeries";
          expect(sutColumnChart.getChartComponentName(chartProperties)).toBe("MSColumn2D");
        });
          
        it("and when visibleCategoriesRange is a number larger than 0 it returns 'ScrollColumn2D'", function () {
          chartProperties.appearance.visibleCategoriesRange = 6;
          expect(sutColumnChart.getChartComponentName(chartProperties)).toBe("ScrollColumn2D");
        });
          
        it("or when stackSeries is 'true' it returns 'StackedColumn2D'", function () {
          chartProperties.appearance.visibleCategoriesRange = null;
          chartProperties.appearance.stackSeries = true;
          expect(sutColumnChart.getChartComponentName(chartProperties)).toBe("StackedColumn2D");
        });

        it("or when stackSeries is 'true' and visibleCategoriesRange is a number larger than 0 it returns 'ScrollStackedColumn2D'", function () {
          chartProperties.appearance.visibleCategoriesRange = 6;
          chartProperties.appearance.stackSeries = true;
          expect(sutColumnChart.getChartComponentName(chartProperties)).toBe("ScrollStackedColumn2D");
        });
      });
    });
      
    describe("it should have a handleError property", function () {
      it("to be defined as a function", function () {
        expect(sutColumnChart.handleError).toBeDefined();
        expect(typeof sutColumnChart.handleError).toBe("function");
      });
      
    // ProgressIndicator not implemented yet
    //describe("it should have a toggleProgressIndicator property", function () {
    //  it("to be defined as a function", function () {
    //    expect(sutColumnChart.toggleProgressIndicator).toBeDefined();
    //    expect(typeof sutColumnChart.toggleProgressIndicator).toBe("function");
    //  });

    //  it("and when it is called with 'true' argument then the indicator is shwon", function () {
    //    sutColumnChart.IsVisible = true;
    //    sutColumnChart.toggleProgressIndicator(true);
    //    var pi = $('[data-sc-id="' + $chartElement.attr("data-sc-id") + 'ProgressIndicator"]');
    //    expect(pi.css("display") === "block").toBe(true);
    //  });

    //  it("and when it is called with 'false' argument then the indicator is hidden", function () {
    //    sutColumnChart.IsVisible = true;
    //    sutColumnChart.toggleProgressIndicator(false);
    //    var pi = $('[data-sc-id="' + $chartElement.attr("data-sc-id") + 'ProgressIndicator"]');
    //    expect(pi.css("display") === "none").toBe(true);
    //  });

    //  it("and when the chart is hidden, if we call toggleprogressIndicator(true) then the indicator is hidden", function () {
    //    sutColumnChart.IsVisible = false;
    //    sutColumnChart.toggleProgressIndicator(true);
    //    var pi = $('[data-sc-id="' + $chartElement.attr("data-sc-id") + 'ProgressIndicator"]');
    //    expect(pi.css("display") === "none").toBe(true);
    //  });
    //});
    });
  });

  describe("Given a ColumnChart Control", function () {    
    $sutEl = $(sutColumnChart.el);

    it("it should have FusionCharts object holding the chart data when data is set to the DynamicData property", function () {
      expect(sutColumnChart).toBeDefined();      
      sutColumnChart.DynamicData = data;
      var id = $sutEl.find("span")[0].id;
      var chartData = FusionCharts(id).getJSONData();
      expect(chartData.data.length).toBe(4);
      expect(chartData.data[0].label).toBe(data.dataset[0].data[0].date);
    });
  });
});