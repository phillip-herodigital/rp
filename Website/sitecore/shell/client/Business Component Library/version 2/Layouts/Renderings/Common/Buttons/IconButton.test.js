describe("Given a Button component", function () {
  var sut = Sitecore.Speak.app.IconButton,
      $sutEl = $(sut.el),
      pageTestCode = Sitecore.Speak.app.PageTestCode;

  it("should exists", function () {
    expect(sut).toBeDefined();
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
  it("should have a ImageUrl property", function () {
    expect(sut.ImageUrl).toBeDefined();
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
  describe("Given a large button", function () {
    var sutLarge = Sitecore.Speak.app.LargeIconButton;
    it("should exists", function () {
      expect(sutLarge).toBeDefined();
    });
  });
});