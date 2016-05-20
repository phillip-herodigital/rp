describe("Given an SubAppRenderer component", function () {
  var sut = _sc.app.SubAppRenderer1;

  it("the component should exist", function () {
    expect(sut).toBeDefined();
  });

  describe("when the SubAppRenderer.ConfigurationItem point to an item", function () {
    it("it shouls conatin the renderings defined in this sub item layout", function () {
      expect(sut.Text2).toBeDefined();
      expect(sut.Text3).toBeDefined();
    });
  });

  describe("the SubPageCode defined in the SubAppRenderer's item layout", function () {
    it("should have access the components defined inside the SubAppRenderer item's layout", function () {
      expect(sut.Text3.Text).toEqual("This text is added at client side by the JS file defined in the SunAppRendererPage.PageCode.PageCodeScriptFileName.");
    });
  });

  describe("the PageCode defined in the layout containing the SubAppRenderer ", function () {
    it("should have access the components defined inside the SubAppRenderer item's layout", function () {
      expect(sut.Text2.Text).toEqual("This text is added at client side by the JS file defined in the SubAppLayout.SubPageCode.PageCodeScriptFileName.");
    });
  });
});