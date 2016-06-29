(function (_sc) {
  describe("Given a FilterControl component", function () {
    var sut = _sc.app.FilterControl,
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
        sut.IsVisible = true; //show it for test purpose
      });
    });
    describe("when I set the some facets", function () {
      it("should render 2 columns in the FilterControl", function () {
        sut.Facets = [{ Name: "toto", Values: [{ Name: "test", DisplayText: "toto", Count: 4 }] }, { Name: "toto", Values: [{ Name: "test", DisplayText: "toto", Count: 4 }] }];
        expect($sutEl.find(".sc-filtercontrol-item").length).toEqual(2);
      });
    });
  });
})(Sitecore.Speak);