describe("Given a RadarChart component", function () {
  var sutRadarChart = Sitecore.Speak.app.RadarChart;
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
    expect(sutRadarChart).toBeDefined();
  });

  describe("Given a RadarChart", function () {    
    $sutEl = $(sutRadarChart.el);

    it("it should have a DynamicData property", function () {
      expect(sutRadarChart.DynamicData).toBeDefined();
    });

    it("it should have a CategoryFilter property", function () {
      expect(sutRadarChart.CategoryFilter).toBeDefined();
    });

    it("it should have a ShowLegend property", function () {
      expect(sutRadarChart.ShowLegend).toBeDefined();
    });
    it("it should have a ShowValues property", function () {
      expect(sutRadarChart.ShowValues).toBeDefined();
    });
    it("it should have a SingleChartHeight property", function () {
      expect(sutRadarChart.SingleChartHeight).toBeDefined();
    });
    it("it should have a EnableAnimation property", function () {
      expect(sutRadarChart.EnableAnimation).toBeDefined();
    });
    it("it should have a DisableSelection property", function () {
      expect(sutRadarChart.DisableSelection).toBeDefined();
    });
    it("it should have a EnableAnimation property", function () {
      expect(sutRadarChart.EnableAnimation).toBeDefined();
    });
    
    it("it should have a ShowPointMarker property", function () {
      expect(sutRadarChart.ShowPointMarker).toBeDefined();
    });
    // Axis
    it("it should have a ShowAxis property", function () {
      expect(sutRadarChart.ShowAxis).toBeDefined();
    });
    // MultiSeries
    it("it should have a SeriesFilter property", function () {
      expect(sutRadarChart.SeriesFilter).toBeDefined();
    });  
    // Client only properties
    it("it should have a NoDataToDisplay property", function () {
      expect(sutRadarChart.NoDataToDisplay).toBeDefined();
    });    
    it("it should have a PropertyNotDefined property", function () {
      expect(sutRadarChart.PropertyNotDefined).toBeDefined();
    });    
      
    it("it should have a ChartProperties property", function () {
      expect(sutRadarChart.chartProperties).toBeDefined();
    });    
  });

  describe("Given a RadarChart Control", function () {
    $sutEl = $(sutRadarChart.el);

    it("it should create the Control when I execute Run", function () {
      expect(sutRadarChart).toBeDefined();       
    
    });

    it("it should not appear when I set the isVisible property", function () {
      var value = false; 
      expect($sutEl.is(":visible")).toEqual(!value);
      sutRadarChart.IsVisible = value;
      expect(sutRadarChart.IsVisible).toEqual(value);
      expect($sutEl.is(":visible")).toEqual(value);
    });

    it("it should be disabled when I set the isEnabled property to false", function () {
      var value = false;
      expect($sutEl.is(":disabled")).toEqual(value);
      sutRadarChart.IsEnabled = value;
      expect(sutRadarChart.IsEnabled).toEqual(value);
      expect($sutEl.is(":disabled")).toEqual(value);
    });
      
    describe("it should have a getChartComponentName property", function () {
      it("to be defined as a function", function () {
        expect(sutRadarChart.getChartComponentName).toBeDefined();
        expect(typeof sutRadarChart.getChartComponentName).toBe("function");
      });

      var chartProperties = {
        appearance: {
          stackSeries: false,
          visibleCategoriesRange: null
        },
        dataType: ""
      };

      it("for every datatype it returns 'Radar'", function () {
        chartProperties.dataType = "SingleSeries";
        expect(sutRadarChart.getChartComponentName(chartProperties)).toBe("Radar");

        chartProperties.dataType = "MultiSeries";
        expect(sutRadarChart.getChartComponentName(chartProperties)).toBe("Radar");
      });
    });
      
    describe("it should have a handleError property", function () {
      it("to be defined as a function", function () {
        expect(sutRadarChart.handleError).toBeDefined();
        expect(typeof sutRadarChart.handleError).toBe("function");
      });
      
    // ProgressIndicator not implemented yet
    //describe("it should have a toggleProgressIndicator property", function () {
    //  it("to be defined as a function", function () {
    //    expect(sutRadarChart.toggleProgressIndicator).toBeDefined();
    //    expect(typeof sutRadarChart.toggleProgressIndicator).toBe("function");
    //  });

    //  it("and when it is called with 'true' argument then the indicator is shwon", function () {
    //    sutRadarChart.IsVisible = true;
    //    sutRadarChart.toggleProgressIndicator(true);
    //    var pi = $('[data-sc-id="' + $chartElement.attr("data-sc-id") + 'ProgressIndicator"]');
    //    expect(pi.css("display") === "block").toBe(true);
    //  });

    //  it("and when it is called with 'false' argument then the indicator is hidden", function () {
    //    sutRadarChart.IsVisible = true;
    //    sutRadarChart.toggleProgressIndicator(false);
    //    var pi = $('[data-sc-id="' + $chartElement.attr("data-sc-id") + 'ProgressIndicator"]');
    //    expect(pi.css("display") === "none").toBe(true);
    //  });

    //  it("and when the chart is hidden, if we call toggleprogressIndicator(true) then the indicator is hidden", function () {
    //    sutRadarChart.IsVisible = false;
    //    sutRadarChart.toggleProgressIndicator(true);
    //    var pi = $('[data-sc-id="' + $chartElement.attr("data-sc-id") + 'ProgressIndicator"]');
    //    expect(pi.css("display") === "none").toBe(true);
    //  });
    //});
    });
  });

  describe("Given a RadarChart Control", function () {    
    $sutEl = $(sutRadarChart.el);

    it("it should have FusionCharts object holding the chart data when data is set to the DynamicData property", function () {
      expect(sutRadarChart).toBeDefined();      
      sutRadarChart.DynamicData = data;
      var id = $sutEl.find("span")[0].id;
      var chartData = FusionCharts(id).getJSONData();
      expect(chartData.data.length).toBe(4);
      expect(chartData.data[0].label).toBe(data.dataset[0].data[0].date);
    });
  });
});