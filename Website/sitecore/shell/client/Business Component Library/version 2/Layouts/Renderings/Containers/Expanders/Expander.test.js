describe("Given an Expander component", function () {
  var sut = _sc.app.Expander,
      $sutEl = $(sut.el);

  it("the component should exist", function () {
    expect(sut).toBeDefined();
  });
  it("the Jquery element should exist", function () {
    expect($sutEl).toBeDefined();
  });
  it("should have an IsVisible Property", function () {
    expect(sut.IsVisible).toBeDefined();
  });
  it("should have an Header Property", function () {
    expect(sut.Header).toBeDefined();
  });
  it("should have an EnableAdditional Property", function () {
    expect(sut.EnableAdditional).toBeDefined();
  });
  it("should have an ShowAdditional Property", function () {
    expect(sut.ShowAdditional).toBeDefined();
  });
  it("should have an ContentHeight Property", function () {
    expect(sut.ContentHeight).toBeDefined();
  });
  it("should have an HeaderIcon Property", function () {
    expect(sut.HeaderIcon).toBeDefined();
  });
  it("should have an IsOpen Property", function () {
    expect(sut.IsOpen).toBeDefined();
  });
  it("should have an IsCollapsible Property", function () {
    expect(sut.IsCollapsible).toBeDefined();
  });
  it("should have an IsStateDiscarded Property", function () {
    expect(sut.IsStateDiscarded).toBeDefined();
  });

  describe("when I set IsOpen to true", function () {
    it("should be opened", function () {
      sut.IsOpen = true;
      expect($sutEl.hasClass("open")).toBeTruthy();
    });
  });
  describe("when I execute toggle", function () {
    it("should be reflected in the html", function () {
      sut.toggle();
      expect($sutEl.hasClass("open")).toBeFalsy();
    });
  });
  describe("when toggle method is executed", function () {
    describe("when event target is not located inside Action Bar", function () {
      var fakeEvent;

      beforeEach(function () {
        fakeEvent = { target: $sutEl.find(".sc-advancedExpander-header") };
      });

      it("it should change value of isOpen property to true if isCollapsible property has value true and isOpen property has value false", function () {
        sut.IsCollapsible = true;
        sut.IsOpen = false;

        sut.toggle({}, fakeEvent);

        expect(sut.IsOpen).toBeTruthy();
      });

      it("it should change value of isOpen property to false if isCollapsible property has value true and isOpen property has value true", function () {
        sut.IsCollapsible = true;
        sut.IsOpen = true;

        sut.toggle({}, fakeEvent);

        expect(sut.IsOpen).toBeFalsy();
      });

      it("it should not change value of isOpen property if isCollapsible property has value false", function () {
        sut.IsCollapsible = false;
        sut.IsOpen = true;

        sut.toggle({}, fakeEvent);

        expect(sut.IsOpen).toBeTruthy();
      });
    });

    describe("when event target is located inside Action Bar", function () {
      it("it should not change value of isOpen property", function () {

        var button = _sc.app.ToggleButton;
        $(button.el).click();
        sut.IsCollapsible = true;
        sut.IsOpen = false;        

        expect(sut.IsOpen).toBeFalsy();
      });
    });
  });

  describe("when toggleAdditional method is executed", function () {
    it("it should change value of showAdditional property to false if previous value of showAdditional propery is true", function () {
      sut.ShowAdditional = true;
      sut.toggleAdditional();
      expect(sut.ShowAdditional).toBeFalsy();
    });

    it("it should change value of showAdditional property to true if previous value of showAdditional propery is false", function () {
      sut.ShowAdditional = false;
      sut.toggleAdditional();
      expect(sut.ShowAdditional).toBeTruthy();
    });
  });

  describe("when showPromotedFields method is executed", function () {
    it("it should change an content of promoted fields container", function () {
      var testContent = "test",
      $promotedFieldsContainer = $sutEl.find(".sc-expander-header-promotedfields");
      $promotedFieldsContainer.empty();
      sut.showPromotedFields(testContent);
      expect($promotedFieldsContainer.is(":empty")).toBeFalsy();
    });
  });

  describe("when hidePromotedFields method is executed", function () {
    it("it should remove content from promoted fields container", function () {
      var testContent = "test",
      $promotedFieldsContainer = $sutEl.find(".sc-expander-header-promotedfields");
      $promotedFieldsContainer.html(testContent);
      sut.hidePromotedFields(testContent);
      expect($promotedFieldsContainer.is(":empty")).toBeTruthy();
    });
  });

  describe("when syncIconWidth method is executed", function () {
    it("it should adjust image container width according to image width if imageUrl property is not empty and image width more then 20px ", function () {
      var imgBase64DataUrl = "data:image/jpeg;base64,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",
      $imageContainer = $sutEl.find(".sc-expander-header-icon-container"),
      imgWidth = 100;
      sut.HeaderIcon = imgBase64DataUrl;
      $imageContainer.find("img").width(imgWidth);
      sut.syncIconWidth();
      expect($imageContainer.width()).toEqual(imgWidth);
    });
  });
});