(function (_sc) {
  describe("Given a Menu component", function () {
    var sut = _sc.app.HyperlinkButtonsGroup,
        $sutEl = $(sut.el);

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("component El should exist", function () {
      expect($sutEl).toBeDefined();
    });
    it("IsVisible should exist", function () {
      expect(sut.IsVisible).toBeDefined();
    });
    it("should have (in this example) 6 menuitems", function () {
      expect($sutEl.find("li").length).toEqual(6);
    });
  });
})(Sitecore.Speak);