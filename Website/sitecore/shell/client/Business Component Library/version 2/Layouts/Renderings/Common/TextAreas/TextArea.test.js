(function (_sc) {
  describe("Given a TextArea component where rows, cols, wrap and maxlength has been set at design time", function () {
    var testValue = "TestValue",
        sut1 = _sc.app.RegularTextArea1,
        sut2 = _sc.app.RegularTextArea2,
        sut3 = _sc.app.RegularTextArea3,
        $sutEl1 = $(sut1.el),
        $sutEl2 = $(sut2.el),
        $sutEl3 = $(sut3.el);

    it("component should exist", function () {
      expect(sut1).toBeDefined();
      expect($sutEl1).toBeDefined();
    });

    it("should have Value Property", function () {
      expect(sut1.Value).toBeDefined();
    });

    it("should have IsVisible Property", function () {
      expect(sut1.IsVisible).toBeDefined();
    });
    it("should have IsEnabled Property", function () {
      expect(sut1.IsEnabled).toBeDefined();
    });
    it("should have TriggerTextChangeOnKeyUp Property", function () {
      expect(sut1.TriggerTextChangeOnKeyUp).toBeDefined();
    });

    it("when Rows=10 the component should have a rows=10 attribute", function () {
      expect($sutEl1.is("[rows]")).toBeTruthy();
      expect($sutEl1.attr("rows")).toBe("10");
    });
    it("when Colums=50 the component should have a cols=50 attribute", function () {
      expect($sutEl1.is("[cols]")).toBeTruthy();
      expect($sutEl1.attr("cols")).toBe("50");
    });
    it("when MaxLenght=100 the component should have a maxlength=100 attribute", function () {
      expect($sutEl1.is("[maxlength]")).toBeTruthy();
      expect($sutEl1.attr("maxlength")).toBe("100");
    });    
    it("when Wrap=hard the component should have a wrap attribute set to 'hard'", function () {
      expect($sutEl1.is("[wrap]")).toBeTruthy();
      expect($sutEl1.attr("wrap")).toBe("hard");
    });
    it("component should have a placholder set to a Value set in layout", function () {
      expect($sutEl1.attr("placeholder")).toEqual("This is a watermark");
    });

    describe("when I change the Value property", function () {
      it("should update the Value of the Textarea", function () {
        sut1.Value = testValue;
        expect($sutEl1.val()).toEqual(testValue);
      });
      it("it should update the Value of another Textarea bound to its value", function () {        
        expect($sutEl3.val()).toEqual(testValue);
      });
    });
    describe("when I change the IsEnabled property", function () {
      it("should be disabled", function () {
        sut1.IsEnabled = false;
        expect($sutEl1.attr("disabled")).toEqual("disabled");
      });
    });
  });
})(Sitecore.Speak);