(function (_sc) {
  describe("Given a TextBox", function () {
    var testValue = "TestValue",
        sut = _sc.app.ButtonTextBox,
        $sutEl = $(sut.el),
        sut1 = _sc.app.ButtonTextBox1,
        $sutEl1 = $(sut1.el),
        sut2 = _sc.app.ButtonTextBox2,
        $sutEl2 = $(sut2.el),
        sutImageButton = _sc.app.ImageButtonTextBox,
        $sutImageButtonEl = $(sutImageButton.el),
        pageTestCode = _sc.app.PageTestCode;

    it("component should exist", function () {
      expect(sut).toBeDefined();
      expect($sutEl).toBeDefined();
    });
    it("should have Value Property", function () {
      expect(sut.Value).toBeDefined();
    });
    it("should have Watermark Property", function () {
      expect(sut.Watermark).toBeDefined();
    });
    it("should have IsVisible Property", function () {
      expect(sut.IsVisible).toBeDefined();
    });
    it("should have IsEnabled Property", function () {
      expect(sut.IsEnabled).toBeDefined();
    });
    it("should have IsReadOnly Property", function () {
      expect(sut.IsReadOnly).toBeDefined();
    });
    it("should have MaxLength Property", function () {
      expect(sut.MaxLength).toBeDefined();
    });
    it("should have Icon Property", function () {
      expect(sut.Icon).toBeDefined();
    });
    it("should have SpritePosition Property", function () {
      expect(sut.SpritePosition).toBeDefined();
    });
    it("should have TriggerTextChangeOnKeyUp Property", function () {
      expect(sut.TriggerTextChangeOnKeyUp).toBeDefined();
    });
    it("should have ButtonText Property", function () {
      expect(sut.ButtonText).toBeDefined();
    });
    describe("when I change the Value property", function () {
      it("should update the Value of the TextBox", function () {
        sut.Value = testValue;
        expect($sutEl.find("input").val()).toEqual(testValue);
      });
    });
    describe("when I change the IsEnabled property", function () {
      it("should be disabled", function () {
        sut.IsEnabled = false;
        expect($sutEl.find("input").attr("disabled")).toEqual("disabled");
        expect($sutEl.find("button").attr("disabled")).toEqual("disabled");

        it("it should not fire my click event when I click the submit button", function () {
          button.click();

          expect(window.globalButtonTextBoxTest).not.toHaveBeenCalled();
        });
      });
    });

    describe("with a maxLength property set to 5", function () {
      it("it should set the text property to contain only the 5 first letters '12345'", function () {        
        sut.MaxLength = 5;        
        sut.Value="123456789";        
        expect(sut.Value).toBe("12345");
      });
    });

    describe("when I use Image in a the Button", function () {
      it("component should exists", function () {
        expect(sutImageButton).toBeDefined();
      });
      it("el should exists", function () {
        expect($sutImageButtonEl).toBeDefined();
      });
      it("should have a Style that sets 'background-image' and 'background-position' on the image", function () {
        var backgroundImage = $sutImageButtonEl.find("button").find("div").css("background-image");         
        var imageIsContained = backgroundImage.indexOf("/sitecore/shell/client/Speak/Assets/img/sc-sprite.png)") > 0;
        expect(imageIsContained).toBe(true);
        expect($sutImageButtonEl.find("button").find("div").css("background-position")).toEqual("-153px -136px");
      });         
    });

    describe("when I set the Watermark property", function () {
       it("should have a placeholder set", function () {
        expect($sutImageButtonEl.find("input").attr("placeholder")).toBeDefined();
      });
    });

    describe("when I define a Click event", function () {
  
      it("when we click, it should execute the function", function () {
        $sutImageButtonEl.find("button").click();
        expect(pageTestCode.NumberClick).toEqual(1);
      });
    });                    

    describe("when I define a ButtonText='ok' (in this example)", function () {
      it("it should have a Button text with the given value", function () {
        expect($sutEl1.find("button > span").html()).toEqual("ok");
      });
    });

    describe("when I define a ButtonType='Primary'", function () {
      it("it should have a Button with 'btn-primary' class", function () {
        var hasClass = $sutEl1.find("button").hasClass("btn-primary");
        expect(hasClass).toBeTruthy();        
      });
    });
    describe("when I define InputType='Text' and KeyboardType='Email'", function () {
      it("it should have an Input element with attribute 'type=email'", function () {
        expect($sutEl2.find("input").attr("type")).toBe("email");        
      });
    });
    describe("when I define InputType='Password' and KeyboardType='Email'", function () {
      it("it should have an Input element with attribute 'type=email'", function () {
        expect($sutEl1.find("input").attr("type")).toBe("password");
      });
    });
  });
})(Sitecore.Speak);