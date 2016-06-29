describe("Given a BarChart component", function () {
  var sutBarChart = Sitecore.Speak.app.BarChart;
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
    expect(sutBarChart).toBeDefined();
  });

  describe("Given a BarChart", function () {    
    $sutEl = $(sutBarChart.el);

    it("it should have a DynamicData property", function () {
      expect(sutBarChart.DynamicData).toBeDefined();
    });

    it("it should have a CategoryFilter property", function () {
      expect(sutBarChart.CategoryFilter).toBeDefined();
    });

    it("it should have a ShowLegend property", function () {
      expect(sutBarChart.ShowLegend).toBeDefined();
    });
    it("it should have a ShowValues property", function () {
      expect(sutBarChart.ShowValues).toBeDefined();
    });
    it("it should have a SingleChartHeight property", function () {
      expect(sutBarChart.SingleChartHeight).toBeDefined();
    });
    it("it should have a EnableAnimation property", function () {
      expect(sutBarChart.EnableAnimation).toBeDefined();
    });
    it("it should have a DisableSelection property", function () {
      expect(sutBarChart.DisableSelection).toBeDefined();
    });
    it("it should have a EnableAnimation property", function () {
      expect(sutBarChart.EnableAnimation).toBeDefined();
    });
    
    it("it should have a ShowPointMarker property", function () {
      expect(sutBarChart.ShowPointMarker).toBeDefined();
    });
    // Axis
    it("it should have a ShowAxis property", function () {
      expect(sutBarChart.ShowAxis).toBeDefined();
    });
    // MultiSeries
    it("it should have a SeriesFilter property", function () {
      expect(sutBarChart.SeriesFilter).toBeDefined();
    });
    // Stacking
    it("it should have a StackSeries property", function () {
      expect(sutBarChart.StackSeries).toBeDefined();
    });  
    // Client only properties
    it("it should have a NoDataToDisplay property", function () {
      expect(sutBarChart.NoDataToDisplay).toBeDefined();
    });    
    it("it should have a PropertyNotDefined property", function () {
      expect(sutBarChart.PropertyNotDefined).toBeDefined();
    });    
      
    it("it should have a ChartProperties property", function () {
      expect(sutBarChart.chartProperties).toBeDefined();
    });    
  });

  describe("Given a BarChart Control", function () {
    $sutEl = $(sutBarChart.el);

    it("it should create the Control when I execute Run", function () {
      expect(sutBarChart).toBeDefined();       
    
    });

    it("it should not appear when I set the isVisible property", function () {
      var value = false; 
      expect($sutEl.is(":visible")).toEqual(!value);
      sutBarChart.IsVisible = value;
      expect(sutBarChart.IsVisible).toEqual(value);
      expect($sutEl.is(":visible")).toEqual(value);
    });

    it("it should be disabled when I set the isEnabled property to false", function () {
      var value = false;
      expect($sutEl.is(":disabled")).toEqual(value);
      sutBarChart.IsEnabled = value;
      expect(sutBarChart.IsEnabled).toEqual(value);
      expect($sutEl.is(":disabled")).toEqual(value);
    });
      
    describe("it should have a getChartComponentName property", function () {
      it("to be defined as a function", function () {
        expect(sutBarChart.getChartComponentName).toBeDefined();
        expect(typeof sutBarChart.getChartComponentName).toBe("function");
      });

      var chartProperties = {
        appearance: {
          stackSeries: false,
          visibleCategoriesRange: null
        },
        dataType: ""
      };

      it("when dataType is 'SingleSeries' it returns 'Bar2D'", function () {
        chartProperties.dataType = "SingleSeries";
        expect(sutBarChart.getChartComponentName(chartProperties)).toBe("Bar2D");
      });

      describe("when dataType is 'MultiSeries'", function () {
        it("it returns 'MSBar2D'", function () {
          chartProperties.dataType = "MultiSeries";
          expect(sutBarChart.getChartComponentName(chartProperties)).toBe("MSBar2D");
        });
          
        it("and when visibleCategoriesRange is a number larger than 0 it returns 'MSBar2D'", function () {
          chartProperties.appearance.visibleCategoriesRange = 6;
          expect(sutBarChart.getChartComponentName(chartProperties)).toBe("MSBar2D");
        });
          
        it("or when stackSeries is 'true' it returns 'StackedBar2D'", function () {
          chartProperties.appearance.visibleCategoriesRange = null;
          chartProperties.appearance.stackSeries = true;
          expect(sutBarChart.getChartComponentName(chartProperties)).toBe("StackedBar2D");
        });
      });
    });
      
    describe("it should have a handleError property", function () {
      it("to be defined as a function", function () {
        expect(sutBarChart.handleError).toBeDefined();
        expect(typeof sutBarChart.handleError).toBe("function");
      });
      
    // ProgressIndicator not implemented yet
    //describe("it should have a toggleProgressIndicator property", function () {
    //  it("to be defined as a function", function () {
    //    expect(sutBarChart.toggleProgressIndicator).toBeDefined();
    //    expect(typeof sutBarChart.toggleProgressIndicator).toBe("function");
    //  });

    //  it("and when it is called with 'true' argument then the indicator is shwon", function () {
    //    sutBarChart.IsVisible = true;
    //    sutBarChart.toggleProgressIndicator(true);
    //    var pi = $('[data-sc-id="' + $chartElement.attr("data-sc-id") + 'ProgressIndicator"]');
    //    expect(pi.css("display") === "block").toBe(true);
    //  });

    //  it("and when it is called with 'false' argument then the indicator is hidden", function () {
    //    sutBarChart.IsVisible = true;
    //    sutBarChart.toggleProgressIndicator(false);
    //    var pi = $('[data-sc-id="' + $chartElement.attr("data-sc-id") + 'ProgressIndicator"]');
    //    expect(pi.css("display") === "none").toBe(true);
    //  });

    //  it("and when the chart is hidden, if we call toggleprogressIndicator(true) then the indicator is hidden", function () {
    //    sutBarChart.IsVisible = false;
    //    sutBarChart.toggleProgressIndicator(true);
    //    var pi = $('[data-sc-id="' + $chartElement.attr("data-sc-id") + 'ProgressIndicator"]');
    //    expect(pi.css("display") === "none").toBe(true);
    //  });
    //});
    });
  });

  describe("Given a BarChart Control", function () {    
    $sutEl = $(sutBarChart.el);

    it("it should have FusionCharts object holding the chart data when data is set to the DynamicData property", function () {
      expect(sutBarChart).toBeDefined();      
      sutBarChart.DynamicData = data;
      var id = $sutEl.find("span")[0].id;
      var chartData = FusionCharts(id).getJSONData();
      expect(chartData.data.length).toBe(4);
      expect(chartData.data[0].label).toBe(data.dataset[0].data[0].date);
    });
  });
});