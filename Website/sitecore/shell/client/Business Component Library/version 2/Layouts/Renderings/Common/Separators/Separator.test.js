(function (_sc) {
  describe("Given a Label component", function () {
    var sut = _sc.app.Separator,
        $sutEl = $(sut.el);

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("component el should exist", function () {
      expect($sutEl).toBeDefined();
    });
    it("component should have a IsVisible property", function () {
      expect(sut.IsVisible).toBeDefined();
    });
  });
})(Sitecore.Speak);