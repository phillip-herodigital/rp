describe("Given a ToggleButton component", function () {
  var sut = Sitecore.Speak.app.RegularToggleButton,
      $sutEl = $(sut.el),
      testValue = "testingValue",
      pageTestCode = Sitecore.Speak.app.PageTestCode;

  it("should exists", function () {
    expect(sut).toBeDefined();
    expect($sutEl).toBeDefined();
  });
  it("should have a Text property", function () {
    expect(sut.Text).toBeDefined();
  });
  it("should have an IsFullWidth property", function () {
    expect(sut.IsFullWidth).toBeDefined();
  });
  it("should have an IsFullWidth property to be false by default", function () {
    expect(sut.IsFullWidth).toBe(false);
  });
  it("should have an IsOpen property", function () {
    expect(sut.IsOpen).toBeDefined();
  });
  it("should have an ShowArrow property", function () {
    expect(sut.ShowArrow).toBeDefined();
  });
  it("should have an Tooltip property", function () {
    expect(sut.Tooltip).toBeDefined();
  });
  it("should have a IsVisible property", function () {
    expect(sut.IsVisible).toBeDefined();
  });
  it("should have a IsEnabled property", function () {
    expect(sut.IsEnabled).toBeDefined();
  });
  it("should have a SpritePosition property", function () {
    expect(sut.SpritePosition).toBeDefined();
  });
  it("should have an Icon property", function () {
    expect(sut.Icon).toBeDefined();
  });
  it("when we click, it should execute the function", function () {
    $sutEl.click();
    expect(pageTestCode.NumberClick).toEqual(1);
  });
  it("when we click but the component is Disabled, it should not trigger the click", function () {
    sut.IsEnabled = false;
    $sutEl.click();
    expect(pageTestCode.NumberClick).toEqual(1);
  });
  describe("when I change the Text property", function () {
    it("text should be reflected in the html", function () {
      sut.Text = testValue;
      expect($sutEl.find(".sc-togglebutton-text").html()).toEqual(testValue);
    });
  });
  describe("Given a large button", function () {
    var sutLarge = Sitecore.Speak.app.LargeToggleButton;
    it("should exists", function () {
      expect(sutLarge).toBeDefined();
    });
  });
  describe("Given a Inverse button", function () {
    var sutInverse = Sitecore.Speak.app.InverseToggleButton;
    it("should exists", function () {
      expect(sutInverse).toBeDefined();
    });
  });
  describe("Given a Primary button", function () {
    var sutPrimary = Sitecore.Speak.app.PrimaryToggleButton;
    it("should exists", function () {
      expect(sutPrimary).toBeDefined();
    });
  });
  describe("Given a Icon button", function () {
    var sutIconButton = Sitecore.Speak.app.IconToggleButton,
        $sutIconButtonEl = $(sutIconButton.el);

    it("should exists", function () {
      expect(sutIconButton).toBeDefined();
    });
    it("when I change the background position, it should be reflected in the html", function () {
      var bgPosition = "-153px -120px";
      sutIconButton.SpritePosition = bgPosition;
      var hasChanged = $sutIconButtonEl.find(".sc-icon").css("background-position").indexOf(bgPosition);
      expect((hasChanged > -1)).toBeTruthy();
    });
  });
  describe("Given a LargeIconButton button", function () {
    var sutLargeIconButton = Sitecore.Speak.app.LargeToggleIconButton;
    it("should exists", function () {
      expect(sutLargeIconButton).toBeDefined();
    });
  });

  describe("Given a ToggleButton", function () {
    var sutClickable = Sitecore.Speak.app.Clickable,
      $sutClickableEl = $(sutClickable.el);

    it("should not have an 'up' class before it is clicked", function () {
      expect($sutClickableEl.hasClass('up')).toBe(false);
    });
    it("should  have an 'up' class after it is clicked", function () {
      $sutClickableEl.click();
      expect($sutClickableEl.hasClass('up')).toBe(true);
    });
  });

  describe("Given a LargeToggleButton", function () {
    var sutLarge = Sitecore.Speak.app.LargeToggleButton;
    it("should exists", function () {
      expect(sutLarge).toBeDefined();
    });
  });


});