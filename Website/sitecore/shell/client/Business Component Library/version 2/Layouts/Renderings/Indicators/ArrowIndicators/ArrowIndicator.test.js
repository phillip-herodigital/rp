describe("Given a ArrowIndicator component", function() {
  var arrowIndicator1 = Sitecore.Speak.app.ArrowIndicator1;
  var arrowIndicator2 = Sitecore.Speak.app.ArrowIndicator2;
  var arrowIndicator3 = Sitecore.Speak.app.ArrowIndicator3;
  var arrowIndicator4 = Sitecore.Speak.app.ArrowIndicator4;
  var arrowIndicator5 = Sitecore.Speak.app.ArrowIndicator5;
  var arrowIndicator6 = Sitecore.Speak.app.ArrowIndicator6;
  var arrowIndicator7 = Sitecore.Speak.app.ArrowIndicator7;
  var indicatorSeverValues = Sitecore.Speak.app.ArrowIndicatorSeverValues;
  var $sutEl1 = $(arrowIndicator1.el);
  var $sutEl2 = $(arrowIndicator2.el);
  var $sutEl3 = $(arrowIndicator3.el);
  var $sutEl4 = $(arrowIndicator4.el);
  var $sutEl5 = $(arrowIndicator5.el);
  var $sutEl6 = $(arrowIndicator6.el);
  var $sutEl7 = $(arrowIndicator7.el);
  var $sutSeverValues = $(indicatorSeverValues.el);

  it("should exists", function() {
    expect(arrowIndicator1).toBeDefined();
  });

  it("it should have a 'IndicatorValue' property", function() {
    expect(arrowIndicator1.IndicatorValue).toBeDefined();
  });

  it("value of the 'OldValue' property should be passed from server", function() {
    expect(indicatorSeverValues.OldValue).toBe(53);
  });

  it("value of the 'NewValue' property should be passed from server", function() {
    expect(indicatorSeverValues.NewValue).toBe(71);
  });

  it("value of the 'ValueFormat' property should be passed from server", function() {
    expect(indicatorSeverValues.ValueFormat).toBe("Percentage");
  });

  it("value of the 'UpArrowColor' property should be passed from server", function() {
    expect(indicatorSeverValues.UpArrowColor).toBe("gray");
  });

  it("value of the 'DownArrowColor' property should be passed from server", function() {
    expect(indicatorSeverValues.DownArrowColor).toBe("#F3A266");
  });

  it("value of the 'EqualSignColor' property should be passed from server", function() {
    expect(indicatorSeverValues.EqualSignColor).toBe("pink");
  });

  it("value of the 'ValueColor' property should be passed from server", function() {
    expect(indicatorSeverValues.ValueColor).toBe("green");
  });

  it("value of the 'ShowMinusSign' property should be passed from server", function() {
    expect(indicatorSeverValues.ShowMinusSign).toBe(true);
  });

  it("value of the 'IsVisible' property should be passed from server", function() {
    expect(indicatorSeverValues.IsVisible).toBe(false);
  });

  it("value of the 'Tooltip' property should be passed from server", function() {
    expect(indicatorSeverValues.Tooltip).toBe("My tooltip");
  });

  describe("when OldValue= 80 and NewValue=100", function() {
    it("it should show a value of 20 and have a IndicatorValue property=20", function() {
      var element = $sutEl1.find("div.sc-ArrowIndicator-Value");
      expect(element.html()).toBe("20");
      expect(arrowIndicator1.IndicatorValue).toBe(20);
    });

    it("it should show a Up green arrow", function() {
      var element = $sutEl1.find(".sc-ArrowIndicator-Arrow svg .sc-ArrowIndicator-Up");
      expect(element.attr('d')).toEqual("M40,0L0,50h20v50h40V50h20L40,0z");
    });
  });

  describe("when ImageSize=X-Small", function() {
    it("it should have and Image with class sc-ArrowIndicator-X-Small", function() {
      var element = $sutEl1.find("div.sc-ArrowIndicator-Arrow.sc-ArrowIndicator-X-Small");
      expect(element).toBeDefined();
    });
  });

  describe("when ValueSize=X-Small", function() {
    it("it should have a Value with class sc-ArrowIndicator-X-Small", function() {
      var element = $sutEl2.find("div.sc-ArrowIndicator-Value.sc-ArrowIndicator-X-Small");
      expect(element).toBeDefined();
    });
  });

  describe("when OldValue= 100 and NewValue=60", function() {
    it("it should show a value of 40 and have a IndicatorValue property=40", function() {
      var element = $sutEl2.find("div.sc-ArrowIndicator-Value");
      expect(element.html()).toBe("40");
      expect(arrowIndicator2.IndicatorValue).toBe(40);
    });
    it("it should show a Down red arrow", function() {
      var element = $sutEl2.find(".sc-ArrowIndicator-Arrow svg .sc-ArrowIndicator-Down");
      expect(element.attr('d')).toEqual("M40,100l40-50H60V0L20,0v50H0L40,100z");
    });
  });

  describe("when ImageSize=Small", function() {
    it("it should have and Image with class sc-ArrowIndicator-Small", function() {
      var element = $sutEl2.find(".sc-ArrowIndicator div.sc-ArrowIndicator-Arrow.sc-ArrowIndicator-Small");
      expect(element).toBeDefined();
    });
  });

  describe("when ValueSize=Medium", function() {
    it("it should have a Value with class sc-ArrowIndicator-Small", function() {
      var element = $sutEl2.find("div.sc-ArrowIndicator-Value.sc-ArrowIndicator-Small");
      expect(element).toBeDefined();
    });
  });

  describe("when OldValue= 100 and NewValue=100", function() {
    it("it should show a value of 0 and have a IndicatorValue property=0", function() {
      var element = $sutEl3.find("div.sc-ArrowIndicator-Value");
      expect(element.html()).toBe("0");
      expect(arrowIndicator3.IndicatorValue).toBe(0);
    });
    it("it should show a Equal gray image", function() {
      var element = $sutEl3.find("div.sc-ArrowIndicator-Arrow rect.sc-ArrowIndicator-Equal");
      expect(element.length).toBe(2);
    });
  });

  describe("when ImageSize=Medium", function() {
    it("it should have and Image with class sc-ArrowIndicator-Medium", function() {
      var element = $sutEl3.find("div.sc-ArrowIndicator-Arrow.sc-ArrowIndicator-Medium");
      expect(element).toBeDefined();
    });
  });

  describe("when ValueSize=Medium", function() {
    it("it should have a Value with class sc-ArrowIndicator-Medium", function() {
      var element = $sutEl3.find("div.sc-ArrowIndicator-Value.sc-ArrowIndicator-Medium");
      expect(element).toBeDefined();
    });
  });

  describe("when ImageSize=Large", function() {
    it("it should have and Image with class sc-ArrowIndicator-Large", function() {
      var element = $sutEl4.find("div.sc-ArrowIndicator-Arrow.sc-ArrowIndicator-Large");
      expect(element).toBeDefined();
    });
  });

  describe("when ValueSize=Large", function() {
    it("it should have a Value with class sc-ArrowIndicator-Large", function() {
      var element = $sutEl4.find("div.sc-ArrowIndicator-Value.sc-ArrowIndicator-Large");
      expect(element).toBeDefined();
    });
  });

  describe("when ImageSize=X-Large", function() {
    it("it should have and Image with class sc-ArrowIndicator-X-Large", function() {
      var element = $sutEl5.find("div.sc-ArrowIndicator-Arrow.sc-ArrowIndicator-X-Large");
      expect(element).toBeDefined();
    });
  });

  describe("when ValueSize=X-Large", function() {
    it("it should have a Value with class sc-ArrowIndicator-X-Large", function() {
      var element = $sutEl5.find("div.sc-ArrowIndicator-Value.sc-ArrowIndicator-X-Large");
      expect(element).toBeDefined();
    });
  });

  describe("when UpArrowColor=#0066FF", function() {
    it("it should have and Image with a path svg element with attribuite fill=#0066FF", function() {
      var element = $sutEl5.find("div.sc-ArrowIndicator-Arrow.sc-ArrowIndicator-X-Large path");
      expect(element).toBeDefined();
      expect(element.attr('fill')).toEqual("#0066FF");
    });
  });

  describe("when ValueColor=#FFFF00", function() {
    it("it should have a Value of color #FFFF00 (style=color: rgb(255, 255, 0);)", function() {
      var element = $sutEl5.find("div.sc-ArrowIndicator-Value.sc-ArrowIndicator-X-Large");
      expect(element).toBeDefined();
      expect(element.attr('style')).toEqual("color: rgb(255, 255, 0);");
    });
  });

  describe("when OldValue= 100 and NewValue=100 and NumberFormat=Percentage", function() {
    it("it should show a value = 100%", function() {
      expect(arrowIndicator6.IndicatorValue).toBe("100%");
    });
  });

  describe("when OldValue= 100 and NewValue=50 and ShowMinusSign=True", function() {
    it("it should show a Down red arrow", function() {
      var element = $sutEl7.find(".sc-ArrowIndicator-Arrow svg .sc-ArrowIndicator-Down");
      expect(element.attr('d')).toEqual("M40,100l40-50H60V0L20,0v50H0L40,100z");
    });

    it("it should show a value of -50 and have a IndicatorValue property=-50", function() {
      var element = $sutEl7.find("div.sc-ArrowIndicator-Value");
      expect(element.html()).toBe("-50");
      expect(arrowIndicator7.IndicatorValue).toBe(-50);
    });

    describe("when calling refreshData(100, 130)", function() {
      it("it should show a Up green arrow", function() {
        arrowIndicator7.refreshData(100, 130);
        var element = $sutEl7.find(".sc-ArrowIndicator-Arrow svg .sc-ArrowIndicator-Up");
        expect(element.attr('d')).toEqual("M40,0L0,50h20v50h40V50h20L40,0z");
      });

      it("it should show a value of 30", function() {
        arrowIndicator7.refreshData(100, 130);
        var element = $sutEl7.find("div.sc-ArrowIndicator-Value");
        expect(element.html()).toBe("30");
      });
      it("it should have a IndicatorValue property=30", function() {
        arrowIndicator7.refreshData(100, 130);
        expect(arrowIndicator7.IndicatorValue).toBe(30);
      });
    });
  });

  describe("when IsVisible property is changed", function() {
    it("control visibility should be changed", function() {
      expect($sutSeverValues.is(":visible")).toBe(false);
      indicatorSeverValues.IsVisible = true;
      expect($sutSeverValues.is(":visible")).toBe(true);
      indicatorSeverValues.IsVisible = false;
      expect($sutSeverValues.is(":visible")).toBe(false);
    });
  });

  describe("when Tooltip property is changed", function() {
    beforeEach(function() {
      indicatorSeverValues.Tooltip = "new tooltip";
    });

    it("control tooltip should be changed", function() {
      expect($sutSeverValues.attr("title")).toBe("new tooltip");
    });
  });
});