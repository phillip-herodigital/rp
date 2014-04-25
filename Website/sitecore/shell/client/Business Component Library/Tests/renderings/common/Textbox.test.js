require(["jasmineEnv", "/-/speak/v1/business/textbox.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a Textbox model", function () {
      var textControl = new Sitecore.Definitions.Models.TextBox();

      describe("when I create a Textbox model", function () {
        it("it should have a text property which holds the value of the Texbox", function () {
          expect(textControl.get("text")).toBeDefined();
        });

        it("it should have a isVisible property that determines if the Textbox is visible or not", function () {
          expect(textControl.get("isVisible")).toBeDefined();
        });

        it("it should set isVisible to true by default", function () {
          expect(textControl.get("isVisible")).toBe(true);
        });
        
        it("it should have a isEnable property that determines if the Textbox is enabled or not", function () {
          expect(textControl.get("isEnabled")).toBeDefined();
        });
        
        it("it should set isEnable to true by default", function () {
          expect(textControl.get("isEnabled")).toBe(true);
        });
        
        it("it should set isReadOnly to false by default", function () {
          expect(textControl.get("isReadOnly")).toBe(false);
        });
        
        it("it should have a isReadOnly property that determines if the Textbox is readonly or not", function () {
          expect(textControl.get("isReadOnly")).toBeDefined();
        });
        
        it("it should set text to null by default", function () {
          expect(textControl.get("text")).toBe(null);
        });
        
        it("it should have a isRequired property", function () {
          expect(textControl.get("isRequired")).toBeDefined();
        });

        it("it should set 'isRequired' to false by default", function () {
          expect(textControl.get("isRequired")).toBe(false);
        });
        
        it("it should have a maxLength property", function () {
          expect(textControl.get("maxLength")).toBeDefined();
        });

        it("it should set maxLength to 0 by default", function () {
          expect(textControl.get("maxLength")).toBe(null);
        });
        
        it("it should have watermark property", function () {
          expect(textControl.get("watermark")).toBeDefined();
        });

        it("it should set watermark to empty string by default", function () {
          expect(textControl.get("watermark")).toBe(null);
        });
      });

      describe("Given an Textbox Control", function () {     
        var model1, model2, model3,
            $element1, $element2, $element3,
            testAreaApp,
            app,
            appNumber = 0,
            nodeApp;

        beforeEach(function () {
          nodeApp = testAreaEl.clone(true);
          nodeApp.attr("id", testAreaEl.attr("id") + appNumber);

          nodeApp.appendTo($("body"));
          testAreaApp = _sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
          appNumber++;

          model1 = testAreaApp.TextboxTest1;
          model2 = testAreaApp.TextboxTest2;
          model3 = testAreaApp.TextboxTest3;

          $element1 = nodeApp.find('[data-sc-id="TextboxTest1"]');
          $element2 = nodeApp.find('[data-sc-id="TextboxTest2"]');
          $element3 = nodeApp.find('[data-sc-id="TextboxTest3"]');

          app = testAreaApp;
        });
        
        it("it should create the control when I execute Run", function () {
          expect(app.TextboxTest1).toBeDefined();
          expect(app.TextboxTest2).toBeDefined();
          expect(app.TextboxTest3).toBeDefined();
        });

        it("it should have the viewModel to be defined inside the model", function () {
          expect(model1.viewModel).toBeDefined();
          expect(model2.viewModel).toBeDefined();
          expect(model3.viewModel).toBeDefined();
        });
        
        it("it should have isReadOnly property equals true", function () {
          expect(model2.get("isReadOnly")).toBe(true);
        });

        it("When I change on the Textbox and I lose focus,  It should update the text value of the Model", function () {
          var value = "text for test from html";
          expect(model2.get("text")).toEqual("Sample text.");
          $element2.val(value).change();
          expect(model2.get("text")).toEqual(value);
        });
        
        it("When I change the ‘text’ value on the Model, It should update the value of the HTML element. ", function () {
          var value = "text for test";
          model1.set("text", value);
          expect(model1.get("text")).toEqual(value);
          expect($element1.val()).toEqual(value);
        });
        
        it("When I set the isReadonly attribute to true, it should be readonly", function () {
          model1.set("isReadOnly", true);
          expect($element1.attr("readonly")).toEqual("readonly");
        });
        
        it("When I set the isVisible property to true it should appear", function () {
          var value = true;
          expect($element3.is(":visible")).toEqual(!value);
          expect(model3.get("isVisible")).toEqual(!value);
          model3.set("isVisible", value);
          expect(model3.get("isVisible")).toEqual(value);
          expect($element3.is(":visible")).toEqual(value);
        });
        
        it("When I set the 'isRequired' attribute to true, it should update the 'required' attribute", function () {
          model1.set("isRequired", true);
          expect($element1.attr("required")).toEqual("required");
        });
        
        it("When I set the 'maxLength' attribute to 30, it should update the 'maxlength' attribute to 30", function () {
          model1.set("maxLength", 30);
          expect($element1.attr("maxlength")).toEqual("30");
        });
        
        it("When I set the 'watermark' attribute to 'Hello', it should update the 'placeholder' attribute to 'Hello'", function () {
          model1.set("watermark", "Hello");
          expect($element1.attr("placeholder")).toEqual("Hello");
        });

      });
    });
  };

  runTests(jasmineEnv, setupTests, "TextBox.htm");
});