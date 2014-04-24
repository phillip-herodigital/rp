require(["jasmineEnv", "sitecore", "/-/speak/v1/business/ProgressIndicator.js"], function (jasmineEnv, sc) {

  var setupTests = function (testAreaEl) {
    var descriptor = {
      attributes: [
        { name: "targetControl", defaultValue: "", which: "which indicates the control to overlay" },
        { name: "isBusy", defaultValue: false, which: "which indicates if the progress indicator is visible or not" },
        { name: "isFullscreen", defaultValue: false, which: "which covers the whole screen" },
        { name: "delay", defaultValue: 200, which: "which contains the number of milliseconds before the indicator appears" },
        { name: "width", defaultValue: 0, which: "which holds the width" },
        { name: "height", defaultValue: 0, which: "which holds the height" },
        { name: "left", defaultValue: 0, which: "which holds the left position" },
        { name: "position", defaultValue: 0, which: "which holds the position" },
        { name: "top", defaultValue: 0, which: "which holds the top position" }
      ]
    };

    describe("Given a ProgressIndicator model", function () {
      var model;
      var $element;

      it("it should create the Control when I execute Run", function () {
        $element = testAreaEl.find(".sc-progressindicator");
        var testArea = _sc.Factories.createApp(testAreaEl.attr("id"));
        expect(testArea.ProgressIndicator).toBeDefined();
        model = testArea.ProgressIndicator;        
      });

      it("When I set the IsBusy=true property in the Model it should be visible", function () {        
        model.set("isBusy", true);
        expect($element.css("display")).toEqual("block");        
      });

      it("When I set the IsBusy=false property in the Model it should be invisible", function () {
        model.set("isBusy", false);
        expect($element.css("display")).toEqual("none");
      });

      it("When I set the IsBusy=true property in the Model, when the model's target is in a dialogWindow, it should have z-index = 3050", function () {
        model.set("targetControl", "ImagePI_dialogWindow");
        model.set("isBusy", true);
        model.viewModel._setZIndex();
        expect($element.css("z-index")).toEqual("3050");
      });

      it("When I set the IsBusy=true property in the Model, when the model's target is in a smartPanel, it should have z-index = 2050", function () {
        model.set("targetControl", "ImagePI_smartPanel");
        model.set("isBusy", false);
        model.set("isBusy", true);
        model.viewModel._setZIndex();
        expect($element.css("z-index")).toEqual("2050");
        model.set("isBusy", false);
      });

    });
    
    runComponentTests("ProgressIndicator", descriptor, "Control1");
  };
  
  runTests(jasmineEnv, setupTests,"ProgressIndicator.html");
});