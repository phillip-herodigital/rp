(function (_sc) {
  describe("Given a Border component", function () {
    var sut = _sc.app.RowPanel,
        $sutEl = $(sut.el);

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("component El should exist", function () {
      expect($sutEl).toBeDefined();
    });
    describe("when we change the IsVisible", function () {
      it("should be reflected in the HTML", function () {
        sut.IsVisible = false;
        expect($sutEl.css("display")).toEqual("none");
      });
    });
    it("should have a Component in the border", function () {
      expect($sutEl.find("[data-sc-id='Text1']")).toBeDefined();
    });
  });
})(Sitecore.Speak);