require(["jasmineEnv", "/-/speak/v1/business/Text.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a Text model", function () {
      var textControl = new Sitecore.Definitions.Models.Text();

      describe("when I create a Text model", function () {
        it("it should have a text property which holds the label", function () {
          expect(textControl.get("text")).toBeDefined();
        });

        it("it should have a isVisible property that determines if the button is visible or not", function () {
          expect(textControl.get("isVisible")).toBeDefined();
        });

        it("it should set isVisible to true by default", function () {
          expect(textControl.get("isVisible")).toBe(true);
        });
      });
      describe("Given an Text Control", function () {
        var model;
        var view;
        var $element;

        it("it should create the Control when I execute Run", function () {
          var app = _sc.Factories.createApp(testAreaEl.attr("id"));
          expect(app.TextTest).toBeDefined();
          $element = testAreaEl.find(".sc-text");
          model = app.TextTest;
        });

        it("When I set the text property in the Model it should set the Text property in the Model and in the HTML", function () {
          var value = "text for test";
          model.set("text", value);
          expect(model.get("text")).toEqual(value);
          expect($element.html()).toEqual(value);
        });
        it("When I set the isVisible property is should not appear", function () {
          var value = false;
          expect($element.is(":visible")).toEqual(!value);
          model.set("isVisible", value);
          expect(model.get("isVisible")).toEqual(value);
          expect($element.is(":visible")).toEqual(value);
        });
      });
    });
  };

  runTests(jasmineEnv, setupTests, "Text.htm");
});