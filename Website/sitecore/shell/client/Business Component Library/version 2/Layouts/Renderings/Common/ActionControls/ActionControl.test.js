(function (_sc) {
  //TODO Add more unit tests.
  describe("Given an ActionControl component", function () {
    var sut = _sc.app.ActionControl,
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
    it("component should have a IsEnabled property", function () {
      expect(sut.IsEnabled).toBeDefined();
    });
    it("component should have a IsOpen property", function () {
      expect(sut.IsOpen).toBeDefined();
    });
    it("component should have a Text property", function () {
      expect(sut.Text).toBeDefined();
    });
    it("should have some aciton", function () {
      var value = "Action1";
      expect($sutEl.find(".sc-actionMenu-item").find(".sc-action-text").html()).toEqual(value);
    });
    describe("when I change the text", function () {
      it("should change the html", function () {
        var value = "value1";
        sut.Text = value;
        expect($sutEl.find(".mainButton").find(".dropdown-text").html()).toEqual(value);
      });
    });
  });
})(Sitecore.Speak);