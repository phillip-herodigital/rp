(function (_sc) {
  describe("Given a ScrollablePanel component", function () {
    var sut = _sc.app.ScrollablePanel,
        $sutEl = $(sut.el);

    describe("When we change the IsVisible", function () {
      it("should be reflected in the HTML", function () {
        sut.IsVisible = false;
        expect($sutEl.css("display")).toEqual("none");
        sut.IsVisible = true;
      });
    });

    describe("Which is Centered, has padding and border", function () {
      var sutBorderCenteredWithBorderAndPadding = _sc.app.SPCenteredWithBorderAndPadding,
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