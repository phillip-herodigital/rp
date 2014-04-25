/// <reference path="../../vendors/jasmine-standalone-1.0.0/jasmine.js" />
/// <reference path="../../jasmine.ui.runner.test.js" />
/// <reference path="../../../Sitecore/Repository/Layouts/Renderings/Common/Buttons/Button.js" />

require(["jasmineEnv", "/-/speak/v1/business/button.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a Button model", function () {
      var button = new Sitecore.Definitions.Models.Button();

      describe("when I create a Button model", function () {
        it("it should have a backgroundPosition property", function () {
          expect(button.get("backgroundPosition")).toBeDefined();
        });
        
        it("it should have an isOpen property", function () {
          expect(button.get("isOpen")).toBeDefined();
        });
        
        it("it should have a isEnabled property that determines if the button is disabled or not", function () {
          expect(button.get("isEnabled")).toBeDefined();
        });

        it("it should have a isVisible property that determines if the button is visible or not", function () {
          expect(button.get("isVisible")).toBeDefined();
        });

        it("it should set isVisible to true by default", function () {
          expect(button.get("isVisible")).toBe(true);
        });
        
        it("it should set isOpen to false by default", function () {
          expect(button.get("isOpen")).toBe(false);
        });
        
        it("it should set backgroundPosition to center by default", function () {
          expect(button.get("backgroundPosition")).toBe("center");
        });

        it("it should set isEnabled true by default", function () {
          expect(button.get("isEnabled")).toBe(true);
        });
        
        it("it should have a text property which holds the label", function () {
          expect(button.get("text")).toBeDefined();
        });

        it("it should have a toggle function that either shows or hides the button depending on the isVisible property", function () {
          expect(button.toggle).toBeDefined();
        });
        
      });

      describe("when I toggle a visible button", function () {
        it("it should set isVisible is false", function () {
          var b = new Sitecore.Definitions.Models.Button();
          b.toggle();

          expect(b.get("isVisible")).toBe(false);
        });
      });

      describe("when I toggle an invisible button", function () {
        it("it should set isVisible is true", function () {
          var b = new Sitecore.Definitions.Models.Button();
          b.set("isVisible", false);
          b.toggle();

          expect(b.get("isVisible")).toBe(true);
        });
      });
    });


    describe("Given a Button Control", function () {
      var model1,
          model2,
          model3,
          $element1,
          $element2,
          $element3;

      it("it should create the Control when I execute Run", function () {
        var testArea = _sc.Factories.createApp(testAreaEl.attr("id"));
        expect(testArea.ButtonTest1).toBeDefined();
        model1 = testArea.ButtonTest1;
        model2 = testArea.ButtonTest2;
        model3 = testArea.ButtonTest3;
        $element1 = testAreaEl.find('[data-sc-id="ButtonTest1"]');
        $element2 = testAreaEl.find('[data-sc-id="ButtonTest2"]');
        $element3 = testAreaEl.find('[data-sc-id="ButtonTest3"]');
      });

      it("when I set the isVisible property is should not appear", function () {
        var value = false;
        expect($element1.is(":visible")).toEqual(!value);
        model1.set("isVisible", value);
        expect(model1.get("isVisible")).toEqual(value);
        expect($element1.is(":visible")).toEqual(value);
      });

      it("it should change the text value of the HTML element", function () {
        model1.set("text", "new value");
        expect(model1.get("text")).toEqual("new value");
        var index = $element1.html().indexOf("new value");
        expect(index).toBe(0);
      });
      
      it("it should set the Element isEnabled property to true", function () {
        expect($element2.is(":disabled")).toEqual(true);
        expect(model2.get("isEnabled")).toEqual(false);
        model2.set("isEnabled", true);
        expect(model2.get("isEnabled")).toEqual(true);
        expect($element2.is(":disabled")).toEqual(false);
      });
      
      it("it should set the Element backgroundPosition property to '-32px -33px'", function () {
        model3.set("backgroundPosition", "-32px -33px");
        expect(model3.get("backgroundPosition")).toEqual("-32px -33px");
      });
      

    });

  };

  runTests(jasmineEnv, setupTests, "Button.htm");
});