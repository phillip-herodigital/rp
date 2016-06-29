describe("Given a Button component", function () {
  var sut = Sitecore.Speak.app.RegularButton,
      $sutEl = $(sut.el),
      testValue = "testingValue",
      pageTestCode = Sitecore.Speak.app.PageTestCode;

  it("should exists", function () {
    expect(sut).toBeDefined();
  });
  it("should have a Text property", function () {
    expect(sut.Text).toBeDefined();
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
  it("should have a Icon property", function () {
    expect(sut.Icon).toBeDefined();
  });
  it("should have an IsFullWidth property", function () {
    expect(sut.IsFullWidth).toBeDefined();
  });
  it("should have an IsFullWidth property to be false by default", function () {
    expect(sut.IsFullWidth).toBe(false);
  });
  it("when we click, it should execute the function", function () {
    $sutEl.click();
    expect(pageTestCode.NumberClick).toEqual(1);
  });
  it("when we click but the component is Disabled, it should trigger the click", function () {
    sut.IsEnabled = false;
    $sutEl.click();
    expect(pageTestCode.NumberClick).toEqual(1);
  });
  describe("when I change the Text property", function () {
    it("text should be reflected in the html", function () {
      sut.Text = testValue;
      expect($sutEl.find(".sc-button-text").html()).toEqual(testValue);
    });
  });
  describe("Given a large button", function () {
    var sutLarge = Sitecore.Speak.app.LargeButton;
    it("should exists", function () {
      expect(sutLarge).toBeDefined();
    });
  });
  describe("Given a Inverse button", function () {
    var sutInverse = Sitecore.Speak.app.InverseButton;
    it("should exists", function () {
      expect(sutInverse).toBeDefined();
    });
  });
  describe("Given a Primary button", function () {
    var sutPrimary = Sitecore.Speak.app.PrimaryButton;
    it("should exists", function () {
      expect(sutPrimary).toBeDefined();
    });
  });
  describe("Given a Icon button", function () {
    var sutIconButton = Sitecore.Speak.app.IconButton,
        $sutIconButtonEl = $(sutIconButton.el);

    it("should exists", function () {
      expect(sutIconButton).toBeDefined();
    });
    it("when I change the sprite position, it should be reflected in the html", function () {
      var bgPosition = "-153px -120px";
      sutIconButton.SpritePosition = bgPosition;
      var hasChanged = $sutIconButtonEl.find(".sc-icon").css("background-position").indexOf(bgPosition);
      expect((hasChanged > -1)).toBeTruthy();
    });
  });
  describe("Given a LargeIconButton button", function () {
    var sutLargeIconButton = Sitecore.Speak.app.LargeIconButton;
    it("should exists", function () {
      expect(sutLargeIconButton).toBeDefined();
    });
  });
  describe("Given a FullWidth button", function () {
    var sutFullWidthButton = Sitecore.Speak.app.FullWidthButton;
    it("should exists", function () {
      expect(sutFullWidthButton).toBeDefined();
    });
  });
  describe("Given a FullWidth button inside a border", function () {
    var sutFullWidthButton = Sitecore.Speak.app.FullWidthButton,
    $sutFullWidthButton = $(sutFullWidthButton.el);
    it("should take all the width of the container", function () {
      expect($sutFullWidthButton.outerWidth()).toBe($sutFullWidthButton.parent().innerWidth());
    });
  });
});