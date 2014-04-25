require(["jasmineEnv", "/-/speak/v1/business/textarea.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a TextArea model", function () {
      var textControl = new Sitecore.Definitions.Models.TextArea();

      describe("when I create a TextArea model", function () {
        it("it should have a text property which holds the value of the TextArea", function () {
          expect(textControl.get("text")).toBeDefined();
        });

        it("it should have a isVisible property that determines if the TextArea is visible or not", function () {
          expect(textControl.get("isVisible")).toBeDefined();
        });

        it("it should set isVisible to true by default", function () {
          expect(textControl.get("isVisible")).toBe(true);
        });
        it("it should set isEnable to true by default", function () {
          expect(textControl.get("isEnabled")).toBe(true);
        });
        it("it should set isReadOnly to false by default", function () {
          expect(textControl.get("isReadOnly")).toBe(false);
        });
        it("it should set 'isRequired' to false by default", function () {
          expect(textControl.get("isRequired")).toBe(false);
        });
        it("it should set 'maxLength' to 0 by default", function () {
          expect(textControl.get("maxLength")).toBe(0);
        });
        it("it should set 'watermark' to empty string by default", function () {
          expect(textControl.get("watermark")).toBe("");
        });
        it("it should set 'cols' to 0 by default", function () {
          expect(textControl.get("cols")).toBe(0);
        });
        it("it should set 'rows' to 0 by default", function () {
          expect(textControl.get("rows")).toBe(0);
        });
        it("it should set 'wrap' to 0 by default", function () {
          expect(textControl.get("wrap")).toBe("");
        });
      });
        
      describe("Given an TextArea Control", function () {
        var model;
        var $element;

        it("it should create the Control when I execute Run", function () {
          var testArea = _sc.Factories.createApp(testAreaEl.attr("id"));
          expect(testArea.TextAreaTest).toBeDefined();

          model = testArea.TextAreaTest;
          $element = testAreaEl.find(".sc-textarea");
        });

        it("When I change on the TextArea and I lose focus, it should update the text value of the Model", function () {
          var value = "text for test from html";
          $element.val(value).change();
          expect(model.get("text")).toEqual(value);
        });
        it("When I change the ‘text’ value on the Model, it should update the value of the HTML element. ", function () {
          var value = "text for test";
          model.set("text", value);
          expect(model.get("text")).toEqual(value);
          expect($element.val()).toEqual(value);
        });
        it("When I set the 'isReadonly' attribute to true, it should be readonly", function () {
          model.set("isReadOnly", true);
          expect($element.attr("readonly")).toEqual("readonly");
        });
        it("When I set the 'isVisible' property is should not appear", function () {
          var value = false;
          expect($element.is(":visible")).toEqual(!value);
          model.set("isVisible", value);
          expect(model.get("isVisible")).toEqual(value);
          expect($element.is(":visible")).toEqual(value);
        });
        it("When I set the 'isRequired' attribute to true, it should update the 'required' attribute", function () {
          model.set("isRequired", true);
          expect($element.attr("required")).toEqual("required");
        });
        it("When I set the 'maxLength' attribute to 30, it should update the 'maxlength' attribute to 30", function () {
          model.set("maxLength", 30);
          expect($element.attr("maxlength")).toEqual("30");
        });
        it("When I set the 'watermark' attribute to 'Hello', it should update the 'placeholder' attribute to 'Hello'", function () {
          model.set("watermark", "Hello");
          expect($element.attr("placeholder")).toEqual("Hello");
        });
        it("When I set the 'cols' attribute to '30', it should update the 'cols' attribute to '30'", function () {
          model.set("cols", "30");
          expect($element.attr("cols")).toEqual("30");
        });
        it("When I set the 'rows' attribute to '30', it should update the 'rows' attribute to '30'", function () {
          model.set("rows", "30");
          expect($element.attr("rows")).toEqual("30");
        });
        it("When I set the 'wrap' attribute to 'hard', it should update the 'wrap' attribute to 'hard'", function () {
          model.set("wrap", "hard");
          expect($element.attr("wrap")).toEqual("hard");
        });
      });
    });
  };

  runTests(jasmineEnv, setupTests, "TextArea.htm");
});