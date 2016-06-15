(function (_sc) {
  describe("Given a Border component", function () {
    var sut = _sc.app.Section,
        $sutEl = $(sut.el);

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("component El should exist", function () {
      expect($sutEl).toBeDefined();
    });
    it("should have a Title in the section", function () {
      expect($sutEl.find(".sc-section-title").html()).toEqual("test");
    });
    it("should have a SubTitle in the section", function () {
      expect($sutEl.find(".sc-section-subTitle").html()).toEqual("test");
    });
    it("should have a Content in the section", function () {
      expect($sutEl.find("h1").html()).toEqual("test");
    });
  });
})(Sitecore.Speak);