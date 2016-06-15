(function (_sc) {
  describe("Given a ContextSwitcher component", function () {
    var sut = _sc.app.ContextSwitcher,
        $sutEl = $(sut.el);
    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("component El should exist", function () {
      expect($sutEl).toBeDefined();
    });
    it("component should have an IsEnabled property", function () {
      expect(sut.IsEnabled).toBeDefined();
    });
    it("component should have an IsVisible property", function () {
      expect(sut.IsVisible).toBeDefined();
    });
    it("component should have an Item property", function () {
      expect(sut.Items).toBeDefined();
    });
    describe("when I want to add some items", function () {
      it("should add the links to the ContextSwitcher", function () {
        sut.Items = [{ Name: "toto", Tooltip: "toto" }, { Name: "toto", Tooltip: "toto" }];

        expect($sutEl.find(".sc-contextswitcher-cell").length).toEqual(2);
      });
    });
    describe("when I isVisible to false", function () {
      it("should not be displayed", function () {
        sut.IsVisible = false;
        expect($sutEl.css("display")).toEqual("none");
      });
    });
    describe("when I IsEnabled to false", function () {
      it("should not be displayed", function () {
        sut.IsEnabled = false;
        expect($sutEl.find(".sc-contextswitcher-togglebutton").attr("disabled")).toEqual("disabled");
      });
    });
  });
})(Sitecore.Speak);