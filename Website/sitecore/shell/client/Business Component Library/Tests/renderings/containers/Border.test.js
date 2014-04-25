require(["jasmineEnv", "/-/speak/v1/business/border.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a Border control", function () {
      var border = new Sitecore.Definitions.Models.Border();

      describe("when I create a Border model", function () {
        it("it should have a height property", function () {
          expect(border.get("height")).toBeDefined();
        });
      });          
    });
    
    describe("Given a Border Control, when Height=100px, Behaviour=Scrolling and content is added to the Border.Content with Height=600px", function () {
      var model,
          $element;

      it("it should create the Control when I execute Run", function () {
        var testArea = _sc.Factories.createApp(testAreaEl.attr("id"));
        expect(testArea.BorderTest).toBeDefined();

        model = testArea.BorderTest;
        $element = testAreaEl.find(".sc-border");
      });

      it("it should show a scrollbar", function () {
        var dragger = $element.find(".mCSB_dragger");
        expect(dragger).toBeDefined();
        var container = $element.find(".mCSB_container");
        expect(container).toBeDefined();
      });
    });    
  };

  runTests(jasmineEnv, setupTests, "Border.htm");
});