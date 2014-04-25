/// <reference path="../../jasmine.ui.runner.test.js" />
/// <reference path="../../../Sitecore/Repository/Layouts/Renderings/Common/HyperlinkButtons/HyperlinkButton.js" />

require(["jasmineEnv", "/-/speak/v1/business/hyperlinkbutton.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a HyperlinkButton model", function () {
      var hyperlinkButton = new Sitecore.Definitions.Models.HyperlinkButton();

      describe("when I create a HyperlinkButton model", function () {
        it("it should have a text property which holds the label", function () {
          expect(hyperlinkButton.get("text")).toBeDefined();
        });

        it("it should have a isEnabled property that determines if the hyperlink is disabled or not", function () {
          expect(hyperlinkButton.get("isEnabled")).toBeDefined();
        });

        it("it should have a isVisible property that determines if the hyperlink is visible or not", function () {
          expect(hyperlinkButton.get("isVisible")).toBeDefined();
        });
        
        it("it should have a isButtonMode property that determines if the hyperlink looks like button or not", function () {
          expect(hyperlinkButton.get("isButtonMode")).toBeDefined();
        });

        it("it should set isVisible to true by default", function () {
          expect(hyperlinkButton.get("isVisible")).toBe(true);
        });

        it("it should set isEnabled true by default", function () {
          expect(hyperlinkButton.get("isEnabled")).toBe(true);
        });
        
        it("it should set isButtonMode to isButtonMode by default", function () {
          expect(hyperlinkButton.get("isButtonMode")).toBe(false);
        });
        
        it("it should have a toggle function that either shows or hides the hyperlink depending on the isVisible property", function () {
          expect(hyperlinkButton.toggle).toBeDefined();
        });
      });

      describe("when I toggle a visible hyperlink", function () {
        it("it should set isVisible is false", function () {
          var b = new Sitecore.Definitions.Models.HyperlinkButton();
          b.toggle();

          expect(b.get("isVisible")).toBe(false);
        });
      });

      describe("when I toggle an invisible hyperlink", function () {
        it("it should set isVisible is true", function () {
          var b = new Sitecore.Definitions.Models.HyperlinkButton();
          b.set("isVisible", false);
          b.toggle();

          expect(b.get("isVisible")).toBe(true);
        });
      });
    });

    describe("Given a HyperLinkButton Control", function () {
      var model1, model2, model3, model4,
            $element1, $element2, $element3, $element4,
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

        model1 = testAreaApp.LinkTest1;
        model2 = testAreaApp.LinkTest2;
        model3 = testAreaApp.LinkTest3;
        model4 = testAreaApp.LinkTest4;

        $element1 = nodeApp.find('[data-sc-id="LinkTest1"]');
        $element2 = nodeApp.find('[data-sc-id="LinkTest2"]');
        $element3 = nodeApp.find('[data-sc-id="LinkTest3"]');
        $element4 = nodeApp.find('[data-sc-id="LinkTest4"]');
        app = testAreaApp;
      });

      afterEach(function () {
        nodeApp.hide();
      });
      
      it("it should create the control when I execute Run", function () {
        expect(app.LinkTest1).toBeDefined();
        expect(app.LinkTest2).toBeDefined();
        expect(app.LinkTest3).toBeDefined();
        expect(app.LinkTest4).toBeDefined();
      });

      it("it should have the viewModel to be defined inside the model", function () {
        expect(model1.viewModel).toBeDefined();
        expect(model2.viewModel).toBeDefined();
        expect(model3.viewModel).toBeDefined();
        expect(model4.viewModel).toBeDefined();
      });

      it("it should set the data-sc-href attribute which is equaled href attribute after initialization inside the model", function () {
        expect($element1.attr("data-sc-href")).toBe($element1.attr("href"));
      });
      
      it("it should remove href attribute from the tag if isEnabled = false after initialization inside the model", function () {
        expect(model3.get("isEnabled")).toBe(false);
        expect($element3.attr("href")).toBe(undefined);
      });
      
      it("it should not appear when I set the isVisible property", function () {
        var value = false;
        expect($element1.is(":visible")).toEqual(!value);
        model1.set("isVisible", value);
        expect(model1.get("isVisible")).toEqual(value);
        expect($element1.is(":visible")).toEqual(value);
      });
      
      it("it should be disabled when I set the isEnabled property to false", function () {
        var value = true;
        expect($element1.is(":disabled")).toEqual(!value);
        model1.set("isEnabled", !value);
        expect(model1.get("isEnabled")).toEqual(!value);
        expect($element1.is(":disabled")).toEqual(!value);
        expect($element1.hasClass("disabled")).toEqual(value);
      });
     
      it("it should be displayed like button when I set the isButtonMode property to true", function () {
        var value = true;
        model1.set("isButtonMode", value);
        expect(model1.get("isButtonMode")).toEqual(value);
        expect($element1.hasClass("btn"));
      });
      
      it("it should set the text property from the hyperlink tag after initialization inside the model", function () {
        expect(model1.get("text")).toBe($element1.html());
        expect(model2.get("text")).toBe($element2.html());
        expect(model3.get("text")).toBe($element3.html());
        expect(model4.get("text")).toBe($element4.html());
      });
      
      it("it should set the isButtonMode property from the hyperlink tag after initialization inside the model", function () {
        expect(model1.get("isButtonMode")).toBe($element1.data("sc-isbuttonmode"));
        expect(model2.get("isButtonMode")).toBe($element2.data("sc-isbuttonmode"));
        expect(model3.get("isButtonMode")).toBe($element3.data("sc-isbuttonmode"));
        expect(model4.get("isButtonMode")).toBe($element4.data("sc-isbuttonmode"));
      });
      
      it("it should have the enabledChange method which should remove href attribute from the tag when hyperlink button is disabled. This method must be called when you change isEnabled property", function () {
        expect(model3.get("isEnabled")).toBe(false);
        expect($element3.attr("href")).toBe(undefined);
        model3.set("isEnabled", true);
        expect($element3.attr("href")).toBe($element3.data("sc-href"));
      });



    });


  };

  runTests(jasmineEnv, setupTests, "HyperLinkButton.htm");
});