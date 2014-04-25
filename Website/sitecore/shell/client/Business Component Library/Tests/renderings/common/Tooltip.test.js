/// <reference path="~/sitecore/shell/client/test/vendors/jasmine-standalone-1.0.0/jasmine.js" />
/// <reference path="../../vendors/jasmine-standalone-1.0.0/jasmine-html.js" />
/// <reference path="../../jasmine.ui.runner.test.js" />
/// <reference path="../../../Sitecore/Repository/Layouts/Renderings/Common/ToolTips/ToolTip.js" />

require(["jasmineEnv", "/-/speak/v1/business/Tooltip.js"], function (jasmineEnv) {
  var setupTests = function () {
    "use strict";
    describe("Given a Tooltip model", function () {

      var tooltip = new Sitecore.Definitions.Models.Tooltip();

      describe("when I create a Tooltip model", function () {

        it("it should have an isVisible property", function () {
          expect(tooltip.get("isVisible")).toBeDefined();
        });

        it("it should set the isVisible property to false", function () {
          expect(tooltip.get("isVisible")).toBe(false);
        });

        it("it should have an animation property", function () {
          expect(tooltip.get("animation")).toBeDefined();
        });

        it("it should have an animation property set to true", function () {
          expect(tooltip.get("animation")).toBe(true);
        });

        it("it should have a html property", function () {
          expect(tooltip.get("html")).toBeDefined();
        });

        it("it should have a html property set to false", function () {
          expect(tooltip.get("html")).toBe(false);
        });

        it("it should have a content property", function () {
          expect(tooltip.get("content")).toBeDefined();
        });

        it("it should have a title property", function () {
          expect(tooltip.get("title")).toBeDefined();
        });

        it("it should have a title property set to an empty string", function () {
          expect(tooltip.get("title")).toBe('');
        });

        it("it should have a trigger property", function () {
          expect(tooltip.get("trigger")).toBeDefined();
        });
        it("it should have a trigger property set to 'hover'", function () {
          expect(tooltip.get("trigger")).toBe('hover');
        });

        it("it should have a placement property", function () {
          expect(tooltip.get("placement")).toBeDefined();
        });

        it("it should have a placement property set to 'bottom'", function () {
          expect(tooltip.get("placement")).toBe('bottom');
        });

        it("it should have a simple property", function () {
          expect(tooltip.get("simple")).toBeDefined();
        });

        it("it should have a simple property set to true", function () {
          expect(tooltip.get("simple")).toBeTruthy();
        });

        it("it should have a delay property", function () {
          expect(tooltip.get("delay")).toBeDefined();
        });

        it("it should have a delay property set to 0", function () {
          expect(tooltip.get("delay")).toBe(0);
        });
      });

      //    describe("changing width, height or background should affect on src property", function () {
      //      beforeEach(function () {
      //        image.set("source", "test");
      //      });
      //      it("width should affect on src", function () {
      //        image.set("width", 100);
      //        expect(image.get("src")).toMatch(/w=100/);
      //      });
      //
      //      it("height should affect on src", function () {
      //        image.set("height", 100);
      //        expect(image.get("src")).toMatch(/h=100/);
      //      });
      //
      //      it("background should affect on src", function () {
      //        image.set("background", "cccccc");
      //        expect(image.get("src")).toMatch(/bc=cccccc/);
      //      });
      //    });
    });
  };
  runTests(jasmineEnv, setupTests);
});