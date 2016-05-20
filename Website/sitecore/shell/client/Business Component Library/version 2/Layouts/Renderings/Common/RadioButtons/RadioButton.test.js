(function (_sc) {
  describe("Given a RadioButton component", function () {
    var sut = _sc.app.RadioButton,
        sutRadioButton2 = _sc.app.RadioButton2,
        $sutEl = $(sut.el),
        $sutRadioButton2El = $(sutRadioButton2.el);

    it("component should exist", function () {
      expect(sut).toBeDefined();
    });
    it("component el should exist", function () {
      expect($sutEl).toBeDefined();
    });
    it("component should have a IsEnabled property", function () {
      expect(sut.IsEnabled).toBeDefined();
    });
    it("component should have a IsVisible property", function () {
      expect(sut.IsVisible).toBeDefined();
    });
    it("component should have a Text property", function () {
      expect(sut.Text).toBeDefined();
    });
    describe("and another radio button with the same group NAme", function () {
      it("component should exist", function () {
        expect(sutRadioButton2).toBeDefined();
      });
      it("component el should exist", function () {
        expect($sutRadioButton2El).toBeDefined();
      });
      describe("When I change checked the First RadioButton", function () {
        it("should set a Value in the app to a variable which has the same name as the groupname", function () {
          sut.IsChecked = true;
          expect(_sc.app[sut.GroupName]).toEqual(sut.Value);
        });
      });
      describe("When I change the value of the second RadioButton", function () {
        it("should set a Value in the app to a variable which has the same name as the groupname", function () {
          sutRadioButton2.IsChecked = true;
          expect(_sc.app[sutRadioButton2.GroupName]).toEqual(sutRadioButton2.Value);
        });
        it("and First Radiobutton should not be checked", function () {
     
          expect(sut.IsChecked).toEqual(false);
        });
      });

    });
  });
})(Sitecore.Speak);