(function (sc) {
  describe("Given a GlobalLogo component", function () {
    var sut = sc.app.GlobalLogo,
        $sutEl = $(sut.el);

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });

    it("component should have a IsVisible property", function () {
      expect(sut.IsVisible).toBeDefined();
    });

    it("the rendered link should not be empty", function () {
      var href = $sutEl.attr("href");
      expect(href[0]).toBe("/");
    });
  });
})(Sitecore.Speak);