describe("Given a Button component", function () {
  var sut = Sitecore.Speak.app.BackButton,
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
      expect($sutEl.find(".sc-backbutton-text").html()).toEqual(testValue);
    });
  });
});