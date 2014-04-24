require(["jasmineEnv", "/-/speak/v1/business/label.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a Label control", function () {
    var labeltControl = new Sitecore.Definitions.Models.Label();

    describe("when I create a Label model", function () {
      it("it should have a text property which holds the label", function () {
        expect(labeltControl.get("text")).toBeDefined();
      });
      it("it should set text to null by default", function () {
        expect(labeltControl.get("text")).toBe(null);
      });

      it("it should have a isVisible property that determines if the button is visible or not", function () {
        expect(labeltControl.get("isVisible")).toBeDefined();
      });

      it("it should set isVisible to true by default", function () {
        expect(labeltControl.get("isVisible")).toBe(true);
      });
    });
    describe("Given an Label Control", function () {
      var model;
      var $element;

      it("it should create the Control when I execute Run", function () {
        var testArea = _sc.Factories.createApp(testAreaEl.attr("id"));
        expect(testArea.LabelTest).toBeDefined();
        model = testArea.LabelTest;
        $element = testAreaEl.find(".sc-label");
      });

      it("When I set the text property in the Model it should set the Text property in the Model and in the HTML", function () {
        var value = "text for test";
        model.set("text", value);
        expect(model.get("text")).toEqual(value);
        expect($element.html()).toEqual(value);
      });
      
      it("When I set the isVisible property to false is shouldn't appear", function () {
        var value = false;
        expect($element.is(":visible")).toEqual(!value);
        model.set("isVisible", value);
        expect(model.get("isVisible")).toEqual(value);
        expect($element.is(":visible")).toEqual(value);
      });
      
    });
  });
  };

  runTests(jasmineEnv, setupTests, "Label.htm");
});