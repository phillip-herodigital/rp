(function (_sc) {
  describe("Given a TextBox", function () {
    var testValue = "TestValue",
        sut = _sc.app.RegularTextBox,
        sut1 = _sc.app.TextBox1,
        sut2 = _sc.app.TextBox2,
        sut3 = _sc.app.TextBox3,
        sut4 = _sc.app.TextBox4,
        sut5 = _sc.app.TextBox5,
        sut6 = _sc.app.TextBox6,
        sut7 = _sc.app.TextBox7,
        sut8 = _sc.app.TextBox8,
        sut9 = _sc.app.TextBox9,
        sut10 = _sc.app.TextBox10,
        sut11 = _sc.app.TextBox11,
        sut12 = _sc.app.TextBox12,
        $sutEl = $(sut.el),
        $sutEl1 = $(sut1.el),       
        $sutEl3 = $(sut3.el);

    it("component should exist", function () {
      expect(sut).toBeDefined();
      expect($sutEl).toBeDefined();
    });
    it("should have Value Property", function () {
      expect(sut.Value).toBeDefined();
    });
    it("it should set Value to null by default", function () {
      expect(sut.Value).toBe("");
    });
    it("should have Watermark Property", function () {
      expect(sut.Watermark).toBeDefined();
    });
    it("it should set watermark to empty string by default", function () {
      expect(sut.Watermark).toBe("");
    });
    it("should have IsVisible Property", function () {
      expect(sut.IsVisible).toBeDefined();
    });
    it("should have IsEnabled Property", function () {
      expect(sut.IsEnabled).toBeDefined();
    });
    it("it should set isReadOnly to false by default", function () {
      expect(sut.IsReadOnly).toBe(false);
    });
    it("should have IsReadOnly Property", function () {
      expect(sut.IsReadOnly).toBeDefined();
    });
    it("should have MaxLength Property", function () {
      expect(sut.MaxLength).toBeDefined();
    });
    it("it should set maxLength to 256 by default", function () {
      expect(sut.MaxLength).toBe(256);
    });
    describe("when I change the Value property", function () {
      it("should update the value of the Textarea", function () {
        sut.Value = testValue;
        expect($sutEl.val()).toEqual(testValue);
      });
    });
    describe("when I change the IsEnabled property", function () {
      it("should be disabled", function () {
        sut.IsEnabled = false;
        expect($sutEl.attr("disabled")).toEqual("disabled");
      });
    });

    describe("Given an Textbox Control", function () {    
      it("it should create the control when I execute Run", function () {
        expect(sut1).toBeDefined();
        expect(sut2).toBeDefined();
        expect(sut3).toBeDefined();
      });

      it("it should have isReadOnly property equals true", function () {
        expect(sut2.IsReadOnly).toBe(true);
      });

      it("When I change the ‘value’ value on the Model, It should update the value of the HTML element. ", function () {
        var value = "text for test";
        sut1.Value = value;
        expect(sut1.Value).toEqual(value);
        expect($sutEl1.val()).toEqual(value);
      });

      it("When I set the isReadonly attribute to true, it should be readonly", function () {
        sut1.IsReadOnly = true;
        expect($sutEl1.attr("readonly")).toEqual("readonly");
      });

      it("When I set the isVisible property to true it should appear", function () {
        var value = true;
        expect($sutEl3.is(":visible")).toEqual(!value);
        expect(sut3.IsVisible).toEqual(!value);
        sut3.set("isVisible", value);
        expect(sut3.IsVisible).toEqual(value);
        expect($sutEl3.is(":visible")).toEqual(value);
      });
      
      it("When I set the 'maxLength' attribute to 30, it should update the 'maxlength' attribute to 30", function () {
        sut1.MaxLength = 30;
        expect($sutEl1.attr("maxlength")).toEqual("30");
      });

      it("When I set the 'watermark' attribute to 'Hello', it should update the 'placeholder' attribute to 'Hello'", function () {
        sut1.Watermark = "Hello";
        expect($sutEl1.attr("placeholder")).toEqual("Hello");
      });


      it("When I set the InputType=Password it should have an attribute type='password'", function () {        
        expect($(sut10.el).attr("type")).toEqual("password");
      });
      it("When I set the InputType=Hidden it should have an attribute type='hidden'", function () {
        expect($(sut4.el).attr("type")).toEqual("hidden");
      });
      it("When I set the InputType=Text and KeyboardType=Email it should have an attribute type='email'", function () {
        expect($(sut5.el).attr("type")).toEqual("email");
      });
      it("When I set the InputType=Password and KeyboardType=Email it should have an attribute type='password'", function () {
        expect($(sut11.el).attr("type")).toEqual("password");
      });
      it("When I set the InputType=Text and KeyboardType=Number it should have an attribute type='number'", function () {
        expect($(sut6.el).attr("type")).toEqual("number");
      });
      it("When I set the InputType=Text and KeyboardType=Telephone it should have an attribute type='tel'", function () {
        expect($(sut7.el).attr("type")).toEqual("tel");
      });
      it("When I set the InputType=Text and KeyboardType=Text it should have an attribute type='text'", function () {
        expect($(sut8.el).attr("type")).toEqual("text");
      });
      it("When I set the InputType='' (default to Text) and KeyboardType=URL it should have an attribute type='url'", function () {
        expect($(sut9.el).attr("type")).toEqual("url");
      });
      it("When the Value property is bound to another component (Textbox 9 is i this example) it should set it's value to '123'", function () {
        expect(sut12.Value).toEqual("123");
      });
    });
  });
})(Sitecore.Speak);