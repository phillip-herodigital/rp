(function (_sc) {
  describe("Given a SmartPanel component", function () {
    var sut = _sc.app.SmartPanel,
        $sutEl = $(sut.el);

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("should have a IsVisible property", function () {
      expect(sut.IsVisible).toBeDefined();
    });
    it("should have a IsOpen property", function () {
      expect(sut.IsOpen).toBeDefined();
    });
    it("should have an open Method", function () {
      expect(sut.open).toBeDefined();
    });
    it("should have an close Method", function () {
      expect(sut.close).toBeDefined();
    });
    it("component El should exist", function () {
      expect($sutEl).toBeDefined();
    });
    it("should have a Component in the border", function () {
      expect($sutEl.find("[data-sc-id='Text1']")).toBeDefined();
    });
    describe("when I want to open a SmartPanel which is closed by default", function () {
      it("ensure that it is closed", function () {
        expect(sut.$el.css("display")).toEqual("none");
      });
      it("when I call the open Method, it should be displayed", function () {
        sut.open();
        expect(sut.IsOpen).toBeTruthy();
        expect(sut.$el.css("display")).toEqual("block");
      });
      it("when I call the close Method, it should be displayed", function () {
        sut.close();
        expect(sut.IsOpen).toBeFalsy();
        expect(sut.$el.css("display")).toEqual("none");
      });
    });
  });
})(Sitecore.Speak);