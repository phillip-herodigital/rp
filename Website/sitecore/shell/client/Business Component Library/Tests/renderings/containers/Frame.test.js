require(["jasmineEnv", "/-/speak/v1/business/frame.js"], function (jasmineEnv) {

  var setupTests = function () {
    "use strict";

    describe("Given a Frame model", function () {
      var frame = new Sitecore.Definitions.Models.Frame();

      describe("when I create a Frame model", function () {
        it("it should have a source property which holds the frame src attribute's value", function () {
          expect(frame.get("sourceUrl")).toBeDefined();
        });

        it("it should have a width property", function () {
          expect(frame.get("width")).toBeDefined();
        });

        it("it should have a height property", function () {
          expect(frame.get("height")).toBeDefined();
        });
      });
    });
  };

  runTests(jasmineEnv, setupTests, "Frame.htm");
});