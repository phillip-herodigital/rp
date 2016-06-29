(function (_sc) {
  describe("Given a ColumnPanel component", function () {
    var sut = _sc.app.ColumnPanel,
        $sutEl = $(sut.el);

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("component El should exist", function () {
      expect($sutEl).toBeDefined();
    });
    it("component El should exist", function () {
      expect($sutEl.hasClass("col-md-6 col-lg6 col-sm-6 col-xs-6 text-left")).toBeTruthy();
    });
    it("should have a Component in the border", function () {
      expect($sutEl.find("[data-sc-id='Text1']")).toBeDefined();
    });
  });
})(Sitecore.Speak);