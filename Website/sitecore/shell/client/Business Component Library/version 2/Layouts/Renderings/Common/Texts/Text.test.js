describe("Given a Text component", function () {
  describe("which has TextSize set to empty", function () {
    var regularTextComponent = Sitecore.Speak.app.Text1;
    var $regularTextComponentEl = $(regularTextComponent.el);
    var testValue = "testValue";

    it("component should exist", function () {
      expect(regularTextComponent).toBeDefined();
    });
    it("component should have a Text property", function () {
      expect(regularTextComponent.Text).toBeDefined();
    });
    it("component should have a 'sc-text' css class", function () {
      var cssClass = $regularTextComponentEl.attr("class");
      expect(cssClass).toEqual("sc-text");
    });
    describe("when I change the Text property", function () {
      regularTextComponent.Text = testValue;
      it("should be reflected on the component html", function () {
        expect($regularTextComponentEl.html()).toEqual(testValue);
      });
    });
    describe("when I change IsVisible property to false", function () {
      it("should be not be shown on the page", function () {
        regularTextComponent.IsVisible = false;
        expect($regularTextComponentEl.css("display")).toEqual("none");
      });
    });
    describe("when I change IsVisible property to true", function () {
      it("should be shown on the page", function () {
        regularTextComponent.IsVisible = true;
        expect($regularTextComponentEl.css("display")).not.toEqual("none");
      });
    });
  });
  describe("which has TextSize set to X-Small", function () {
    var labelTextComponent = Sitecore.Speak.app.Text2;
    var $labelTextComponentEl = $(labelTextComponent.el);

    it("component should have the 'x-small' class", function () {
      var hasClass = $labelTextComponentEl.hasClass("x-small");
      expect(hasClass).toBeTruthy();
    });
  });
  describe("which has TextSize set to Small", function () {
    var helpLabelTextComponent = Sitecore.Speak.app.Text10;
    var $helpLabelTextComponentEl = $(helpLabelTextComponent.el);

    it("component should have the 'small' class", function () {
      var hasClass = $helpLabelTextComponentEl.hasClass("small");
      expect(hasClass).toBeTruthy();
    });
  });
  describe("which has TextSize set to Medium", function () {
    var largeLabelTextComponent = Sitecore.Speak.app.Text3;
    var $largeLabelTextComponentEl = $(largeLabelTextComponent.el);

    it("component should have the 'medium' class", function () {
      var hasClass = $largeLabelTextComponentEl.hasClass("medium");
      expect(hasClass).toBeTruthy();
    });
  });
  describe("which has TextSize set to Large", function () {
    var valueTextComponent = Sitecore.Speak.app.Text4;
    var $valueTextComponentEl = $(valueTextComponent.el);

    it("component should have the 'large' class", function () {
      var hasClass = $valueTextComponentEl.hasClass("large");
      expect(hasClass).toBeTruthy();
    });
  });
  describe("which has TextSize set to X-Large", function () {
    var largeValueComponent = Sitecore.Speak.app.Text5;
    var $largeValueComponentEl = $(largeValueComponent.el);

    it("component should have the 'x-large' class", function () {
      var hasClass = $largeValueComponentEl.hasClass("x-large");
      expect(hasClass).toBeTruthy();
    });
  });
  describe("which has TextSize set to XX-Large", function () {
    var largeValueComponent = Sitecore.Speak.app.Text6;
    var $largeValueComponentEl = $(largeValueComponent.el);

    it("component should have the 'xx-large' class", function () {
      var hasClass = $largeValueComponentEl.hasClass("xx-large");
      expect(hasClass).toBeTruthy();
    });
  });
  describe("which has TextSize set to XXX-Large and TextWeight set to 'Bold'", function () {
    var largeValueComponent = Sitecore.Speak.app.Text7;
    var $largeValueComponentEl = $(largeValueComponent.el);

    it("component should have the 'xxx-large' class", function () {
      var hasClass = $largeValueComponentEl.hasClass("xxx-large");
      expect(hasClass).toBeTruthy();
    });
    it("component should have the 'bold' class", function () {
      var hasClass = $largeValueComponentEl.hasClass("bold");
      expect(hasClass).toBeTruthy();
    });
  });
  describe("which has TextSize set to XXX-Large and TextStylee set to 'Italic'", function () {
    var largeValueComponent = Sitecore.Speak.app.Text8;
    var $largeValueComponentEl = $(largeValueComponent.el);

    it("component should have the 'xxx-large' class", function () {
      var hasClass = $largeValueComponentEl.hasClass("xxx-large");
      expect(hasClass).toBeTruthy();
    });
    it("component should have the 'italic' class", function () {
      var hasClass = $largeValueComponentEl.hasClass("italic");
      expect(hasClass).toBeTruthy();
    });
  });
 
  describe("which has its Text property set via StaticData", function () {
    it("component should have the text set to 'From StaticData'", function () {
      expect(Sitecore.Speak.app.FromStaticDataText.Text).toEqual("From StaticData");
    });
  });

  describe("which has its Text property bound to another component property", function () {
    it("component should have the text set to 'From StaticData'", function () {
      expect(Sitecore.Speak.app.Text11.Text).toEqual("From StaticData");
    });
  });
});