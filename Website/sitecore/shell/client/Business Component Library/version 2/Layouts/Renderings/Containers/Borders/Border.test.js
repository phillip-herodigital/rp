(function (_sc) {
  describe("Given a Border component", function () {
    var sut = _sc.app.Border,
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
    describe("which is Centered, has padding and border", function () {
      var sutBorderCenteredWithBorderAndPadding = _sc.app.BorderCenteredWithBorderAndPadding,
        $sutBorderCenteredWithBorderAndPaddingEl = $(sutBorderCenteredWithBorderAndPadding.el);
      it("component should exist", function () {
        expect(sutBorderCenteredWithBorderAndPadding).toBeDefined();
      });
      it("component El should exist", function () {
        expect($sutBorderCenteredWithBorderAndPaddingEl).toBeDefined();
      });
      it("should have a class sc-show-border", function () {
        expect($sutBorderCenteredWithBorderAndPaddingEl.hasClass("sc-show-border")).toBeTruthy();
      });
      it("should have a class sc-align-center", function () {
        expect($sutBorderCenteredWithBorderAndPaddingEl.hasClass("sc-align-center")).toBeTruthy();
      });
      it("should have a class sc-show-padding", function () {
        expect($sutBorderCenteredWithBorderAndPaddingEl.hasClass("sc-show-padding")).toBeTruthy();
      });
    });
  });
})(Sitecore.Speak);