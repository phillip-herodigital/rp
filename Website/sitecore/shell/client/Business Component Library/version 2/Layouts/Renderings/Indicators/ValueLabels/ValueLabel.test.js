describe("Given a ValueLabel component", function() {
  var valueLabel1 = Sitecore.Speak.app.ValueLabel1;
  var valueLabel2 = Sitecore.Speak.app.ValueLabel2;
  var valueLabel3 = Sitecore.Speak.app.ValueLabel3;
  var valueLabel4 = Sitecore.Speak.app.ValueLabel4;
  var valueLabel5 = Sitecore.Speak.app.ValueLabel5;
  var valueLabel6 = Sitecore.Speak.app.ValueLabel6;
  var valueLabel7 = Sitecore.Speak.app.ValueLabel7;
  var labelSeverProperties = Sitecore.Speak.app.ValueLabelSeverProperties;

  var $valueLabelEl1 = $(valueLabel1.el);
  var $valueLabelEl2 = $(valueLabel2.el);
  var $valueLabelEl3 = $(valueLabel3.el);
  var $valueLabelEl4 = $(valueLabel4.el);
  var $valueLabelEl5 = $(valueLabel5.el);
  var $valueLabelEl6 = $(valueLabel6.el);
  var $valueLabelEl7 = $(valueLabel7.el);
  var $labelSeverProperties = $(labelSeverProperties.el);

  var data = {
    "dataset": [
    {
      "data": [
        {
          name: "Visits",
          value: 100
        },
        {
          name: "Visits",
          value: 50
        },
        {
          name: "Visits",
          value: 10
        }
      ]
    }
    ]
  };

  valueLabel1.DynamicData = data;
  valueLabel2.DynamicData = data;
  valueLabel3.DynamicData = data;
  valueLabel4.DynamicData = data;
  valueLabel5.DynamicData = data;
  valueLabel6.DynamicData = data;
  valueLabel7.DynamicData = data;

  it("should exists", function() {
    expect(valueLabel1).toBeDefined();
  });

  it("it should have a 'Value' property", function() {
    expect(valueLabel1.Value).toBeDefined();
  });

  it("it should have bindable 'DynamicData' property", function() {
    expect(labelSeverProperties.DynamicData.dataset[0].data.length).toBe(3);
  });

  it("value of the 'ValueColor' property should be passed from server", function() {
    expect(labelSeverProperties.ValueColor).toBe("pink");
  });

  it("value of the 'Label' property should be passed from server", function() {
    expect(labelSeverProperties.Label).toBe("My label");
  });

  it("value of the 'LabelColor' property should be passed from server", function() {
    expect(labelSeverProperties.LabelColor).toBe("#F3A266");
  });

  it("value of the 'DataFieldName' property should be passed from server", function() {
    expect(labelSeverProperties.DataFieldName).toBe("value");
  });

  it("value of the 'DataFunction' property should be passed from server", function() {
    expect(labelSeverProperties.DataFunction).toBe("Sum");
  });

  it("value of the 'IsVisible' property should be passed from server", function() {
    expect(labelSeverProperties.IsVisible).toBe(false);
  });

  it("value of the 'Tooltip' property should be passed from server", function() {
    expect(labelSeverProperties.Tooltip).toBe("My tooltip");
  });

  describe("when Label='Sitecore'", function() {
    it("it should a label of value 'Sitecore'", function() {
      var element = $valueLabelEl1.find("div.sc-ValueLabel-Label");
      expect(element.html()).toBe("Sitecore");
    });
  });
  describe("when ValuelSize='X-Small'", function() {
    it("it should a value element with class 'X-Small'", function() {
      var element = $valueLabelEl1.find("div.sc-ValueLabel-Value sc-ValueLabel-X-Small");
      expect(element).toBeDefined();
    });
  });
  describe("when LabelSize='X-Small'", function() {
    it("it should a label element with class 'X-Small'", function() {
      var element = $valueLabelEl1.find("div.sc-ValueLabel-Label.sc-ValueLabel-X-Small");
      expect(element).toBeDefined();
    });
  });
  describe("when ValuelSize='Small'", function() {
    it("it should a value element with class 'Small'", function() {
      var element = $valueLabelEl2.find("div.sc-ValueLabel-Value sc-ValueLabel-Small");
      expect(element).toBeDefined();
    });
  });
  describe("when LabelSize='Small'", function() {
    it("it should a label element with class 'Small'", function() {
      var element = $valueLabelEl2.find("div.sc-ValueLabel-Label.sc-ValueLabel-Small");
      expect(element).toBeDefined();
    });
  });
  describe("when ValuelSize='Medium'", function() {
    it("it should a value element with class 'Medium'", function() {
      var element = $valueLabelEl3.find("div.sc-ValueLabel-Value sc-ValueLabel-Medium");
      expect(element).toBeDefined();
    });
  });
  describe("when LabelSize='Medium'", function() {
    it("it should a label element with class 'Medium'", function() {
      var element = $valueLabelEl3.find("div.sc-ValueLabel-Label.sc-ValueLabel-Medium");
      expect(element).toBeDefined();
    });
  });
  describe("when ValuelSize='Large'", function() {
    it("it should a value element with class 'Large'", function() {
      var element = $valueLabelEl4.find("div.sc-ValueLabel-Value sc-ValueLabel-Large");
      expect(element).toBeDefined();
    });
  });
  describe("when LabelSize='Large'", function() {
    it("it should a label element with class 'Large'", function() {
      var element = $valueLabelEl4.find("div.sc-ValueLabel-Label.sc-ValueLabel-Large");
      expect(element).toBeDefined();
    });
  });
  describe("when ValuelSize='X-Large'", function() {
    it("it should a value element with class 'X-Large'", function() {
      var element = $valueLabelEl5.find("div.sc-ValueLabel-Value sc-ValueLabel-X-Large");
      expect(element).toBeDefined();
    });
  });
  describe("when LabelSize='X-Large'", function() {
    it("it should a label element with class 'X-Large'", function() {
      var element = $valueLabelEl5.find("div.sc-ValueLabel-Label.sc-ValueLabel-X-Large");
      expect(element).toBeDefined();
    });
  });
  describe("when LabelPosition='Bottom'", function() {
    it("it should a label  element container with calss 'sc-Bottom'", function() {
      var element = $valueLabelEl1.find("div.sc-ValueLabel-Cell sc-Bottom");
      expect(element).toBeDefined();
    });
  });
  describe("when LabelPosition='Right'", function() {
    it("it should a label  element container with calss 'sc-Right'", function() {
      var element = $valueLabelEl2.find("div.sc-ValueLabel-Cell sc-Right");
      expect(element).toBeDefined();
    });
  });
  describe("when LabelPosition='Top'", function() {
    it("it should a label  element container with calss 'sc-Top'", function() {
      var element = $valueLabelEl3.find("div.sc-ValueLabel-Cell sc-Top");
      expect(element).toBeDefined();
    });
  });
  describe("when ValueColor=#990000", function() {
    it("it should have a Value of color #990000 (style=color: rgb(153, 0, 0);)", function() {
      var element = $valueLabelEl5.find("div.sc-ValueLabel-Value");
      expect(element).toBeDefined();
      expect(element.attr('style')).toEqual("color: rgb(153, 0, 0);");
    });
  });
  describe("when LabelColor=#33CC33", function() {
    it("it should have a Label of color #33CC33 (style=color: rgb(51, 204, 51);)", function() {
      var element = $valueLabelEl4.find("div.sc-ValueLabel-Label");
      expect(element).toBeDefined();
      expect(element.attr('style')).toEqual("color: rgb(51, 204, 51);");
    });
  });
  describe("and given DynamicData = {'dataset':[{'data': [{name: 'Visits',value: 100},{name: 'Visits',value: 50},{name: 'Visits',value: 10}]]}", function() {
    it("it should a value of 160 when DataFunction='Sum'", function() {
      var element = $valueLabelEl1.find("div.sc-ValueLabel-Value");
      expect(element.html()).toBe("160");
      expect(valueLabel1.Value).toBe(160);
    });
    it("it should a value of 53.33 when DataFunction='Average'", function() {
      var element = $valueLabelEl2.find("div.sc-ValueLabel-Value");
      expect(element.html().replace(',', '.')).toBe('53.33');
      expect(valueLabel2.Value.replace(',', '.')).toBe('53.33');
    });
    it("it should a value of 100 when DataFunction='Max'", function() {
      var element = $valueLabelEl3.find("div.sc-ValueLabel-Value");
      expect(element.html()).toBe("100");
      expect(valueLabel3.Value).toBe(100);
    });
    it("it should a value of 10 when DataFunction='Min'", function() {
      var element = $valueLabelEl4.find("div.sc-ValueLabel-Value");
      expect(element.html()).toBe("10");
      expect(valueLabel4.Value).toBe(10);
    });
    it("it should a value of 100 when DataFunction='First'", function() {
      var element = $valueLabelEl5.find("div.sc-ValueLabel-Value");
      expect(element.html()).toBe("100");
      expect(valueLabel5.Value).toBe(100);
    });
    it("it should a value of 10 when DataFunction='Last'", function() {
      var element = $valueLabelEl6.find("div.sc-ValueLabel-Value");
      expect(element.html()).toBe("10");
      expect(valueLabel6.Value).toBe(10);
    });
    it("it should a value of '-' when DataFunction is not defined", function() {
      var element = $valueLabelEl7.find("div.sc-ValueLabel-Value");
      expect(element.html()).toBe("-");
      expect(valueLabel7.Value).toBe("-");
    });
  });

  describe("when calling setValue(200)", function() {
    it("it should show Value of 200", function() {
      valueLabel1.setValue(200);
      var element = $valueLabelEl1.find("div.sc-ValueLabel-Value");
      expect(element.html()).toBe("200");
      expect(valueLabel1.Value).toBe(200);
    });
  });
  describe("when calling setColors('#990000','#33CC33')", function() {
    valueLabel1.setColors('#990000', '#33CC33');
    it("it should have a Value of color #990000 (style=color: rgb(153, 0, 0);)", function() {
      var element = $valueLabelEl1.find("div.sc-ValueLabel-Value");
      expect(element).toBeDefined();
      expect(element.attr('style')).toEqual("color: rgb(153, 0, 0);");
    });
    it("it should have a Label of color #33CC33 (style=color: rgb(51, 204, 51);)", function() {
      var element = $valueLabelEl1.find("div.sc-ValueLabel-Label");
      expect(element).toBeDefined();
      expect(element.attr('style')).toEqual("color: rgb(51, 204, 51);");
    });
  });

  describe("when IsVisible property is changed", function() {
    it("control visibility should be changed", function() {
      expect($labelSeverProperties.is(":visible")).toBe(false);
      labelSeverProperties.IsVisible = true;
      expect($labelSeverProperties.is(":visible")).toBe(true);
      labelSeverProperties.IsVisible = false;
      expect($labelSeverProperties.is(":visible")).toBe(false);
    });
  });

  describe("when Tooltip property is changed", function() {
    beforeEach(function() {
      labelSeverProperties.Tooltip = "new tooltip";
    });

    it("control tooltip should be changed", function() {
      expect($labelSeverProperties.attr("title")).toBe("new tooltip");
    });
  });
});