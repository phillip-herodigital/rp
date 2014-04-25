/// <reference path="../../vendors/jasmine-standalone-1.0.0/jasmine.js" />
/// <reference path="../../jasmine.ui.runner.test.js" />
/// <reference path="../../../Sitecore/Repository/Layouts/Renderings/Common/Buttons/Button.js" />

require(["jasmineEnv", "/-/speak/v1/business/button.js", "/-/speak/v1/business/togglebutton.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a Button model", function () {
      var toggleButton = new Sitecore.Definitions.Models.ToggleButton();

      describe("when I create a ToggleButton model", function () {
        it("it should have an text property", function () {
          expect(toggleButton.get("text")).toBeDefined();
        });

        it("it should set text to null by default", function () {
          expect(toggleButton.get("text")).toBe(null);
        });

        it("it should have a backgroundPosition property", function () {
          expect(toggleButton.get("backgroundPosition")).toBeDefined();
        });

        it("it should set backgroundPosition to 'center' by default", function () {
          expect(toggleButton.get("backgroundPosition")).toBe("center");
        });

        it("it should have an isOpen property", function () {
          expect(toggleButton.get("isOpen")).toBeDefined();
        });

        it("it should set isOpen to null by default", function () {
          expect(toggleButton.get("isOpen")).toBe(null);
        });
      });

      describe("Given a DropDownButton Control", function () {
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

          model1 = testAreaApp.ToggleButtonTest1;
          model2 = testAreaApp.ToggleButtonTest2;
          model3 = testAreaApp.ToggleButtonTest3;

          $element1 = nodeApp.find('[data-sc-id="ToggleButtonTest1"]');
          $element2 = nodeApp.find('[data-sc-id="ToggleButtonTest2"]');
          $element3 = nodeApp.find('[data-sc-id="ToggleButtonTest3"]');
          app = testAreaApp;
        });

        afterEach(function () {
          nodeApp.hide();
        });

        it("it should create the control when I execute Run", function () {
          expect(app.ToggleButtonTest1).toBeDefined();
          expect(app.ToggleButtonTest2).toBeDefined();
          expect(app.ToggleButtonTest3).toBeDefined();
        });

        it("it should have the viewModel to be defined inside the model", function () {
          expect(model1.viewModel).toBeDefined();
          expect(model2.viewModel).toBeDefined();
          expect(model3.viewModel).toBeDefined();
        });
        
        it("it should set the text property from button label after initialization inside the model", function () {
          expect(model1.get("text")).toBe($element1.find(".sc-togglebutton-text").html());
          expect(model2.get("text")).toBe($element2.find(".sc-togglebutton-text").html());
          expect(model3.get("text")).toBe($element3.find(".sc-togglebutton-text").html());
        });

        it("it should set the imageUrl property to '/sitecore/shell/client/Speak/Assets/img/sc-sprite.png' after initialization inside the model", function () {
          expect(model3.get("imageUrl")).toBe("/sitecore/shell/client/Speak/Assets/img/sc-sprite.png");
        });

        it("it should set the backgroundPosition property from html of the button after initialization inside the model", function () {
          expect(model3.get("backgroundPosition")).toBe("-32px -34px");
        });
        
        it("it should have the toogle method to change isOpen property to the opposite inside viewModel", function () {
          model1.set("isOpen", true);
          
          model1.viewModel.toggle();
          expect(model1.get("isOpen")).toBe(false);
          expect($element1.hasClass("up")).toBe(false);
          
          model1.viewModel.toggle();
          expect($element1.hasClass("up")).toBe(true);
          expect(model1.get("isOpen")).toEqual(true);
        });
        
        it("it should have the open method to change isOpen property to true inside viewModel", function () {
          model1.set("isOpen", false);
          model1.viewModel.open();
          expect(model1.get("isOpen")).toBe(true);
        });

        it("it should have the close method to change isOpen property to false inside viewModel", function () {
          model1.viewModel.open();
          model1.viewModel.close();
          expect(model1.get("isOpen")).toBe(false);
        });


      });
      
    });

  };

  runTests(jasmineEnv, setupTests, "ToggleButton.htm");
});