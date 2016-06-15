(function (_sc) {
  describe("Given a SearchPanel component", function () {
    var sut = _sc.app.SearchPanel,
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
    describe("when I set the property IsVisible to false", function () {
      it("component should not be visible", function () {
        sut.IsVisible = false;
        expect($sutEl.css("display")).toEqual("none");
      });
    });
  });
})(Sitecore.Speak);