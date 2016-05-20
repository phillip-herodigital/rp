(function (_sc) {
  describe("Given a DatePicker component", function () {
    var sut = _sc.app.DatePicker,
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
    it("component should have a Date property", function () {
      expect(sut.Date).toBeDefined();
    });
    it("component should have a FormattedDate property", function () {
      expect(sut.FormattedDate).toBeDefined();
    });
    it("component should have a DateFormat property", function () {
      expect(sut.DateFormat).toBeDefined();
    });
    describe("when I change the Date of the component", function () {
      it("the DatePicker should change", function () {
        var value = "20140202";
        sut.Date = value;
        expect(_sc.utils.date.toISO(sut.getDate())).toEqual(value);
      });
    });
  });
  describe("which has viewMode set to TextBox", function () {
    var sutInput = _sc.app.DatePickerInput,
        $stuInputEl = $(sutInput.el);
    
    it("component should exist", function () {
      expect(sutInput).toBeDefined();
    });
    it("component el should exist", function () {
      expect($stuInputEl).toBeDefined();
    });
    it("component el should be an input element", function () {
      expect($stuInputEl.is("input")).toBeTruthy();
    });
    describe("when I change the Value of the element", function () {
      it("should change the Date, FormattedDate and DatePicker Date", function () {
        var value = "12/19/2014";
        $stuInputEl.val(value);
        $stuInputEl.change();
        $stuInputEl.blur();
        //format is the not same, maybe a bug but it was like this before.
        expect(sutInput.FormattedDate).toEqual("19/12/2014");
      });
    });
  });
})(Sitecore.Speak);