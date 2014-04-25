/// <reference path="../../jasmine.ui.runner.test.js" />
/// <reference path="../../../Sitecore/Repository/Layouts/Renderings/Containers/Accordions/Accordion.js" />

require(["jasmineEnv", "/-/speak/v1/business/accordion.js"], function (jasmineEnv) {
  var setupTests = function () {
    "use strict";

    describe("Given an Accordion", function () {
      var accordion = new Sitecore.Definitions.Models.Accordion();

      it("it should have an 'isVisible' property", function () {
        expect(accordion.get("isVisible")).toBeDefined();
      });
      it("it should have a 'header' property", function () {
        expect(accordion.get("header")).toBeDefined();
      });
      it("it should have a 'isOpen' property", function () {
        expect(accordion.get("isOpen")).toBeDefined();
      });
      it("it should have a 'showAdditional' property", function () {
        expect(accordion.get("showAdditional")).toBeDefined();
      });

      describe("when I create an Accordion", function () {
        it("It should have ’isVisible’ set to ’true’", function () {
          expect(accordion.get("isVisible")).toEqual(true);
        });
        it("It should have ’header’ set to empty string", function () {
          expect(accordion.get("header")).toEqual("");
        });
        it("It should have ’isOpen’ set to ’true’", function () {
          expect(accordion.get("isOpen")).toEqual(true);
        });
        it("It should have ’showAdditional’ set to ’false’", function () {
          expect(accordion.get("showAdditional")).toEqual(false);
        });
      });
    });
  };

  runTests(jasmineEnv, setupTests);
});
