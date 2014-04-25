/// <reference path="../../jasmine.ui.runner.test.js" />
/// <reference path="../../../Sitecore/Repository/Layouts/Renderings/Common/Images/Image.js" />

require(["jasmineEnv", "/-/speak/v1/business/image.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given an Image model", function () {
      var image = new Sitecore.Definitions.Models.Image();
      describe("when I create an Image model", function () {

        it("it should have a width property", function () {
          expect(image.get("width")).toBeDefined();
        });

        it("it should have a height property", function () {
          expect(image.get("height")).toBeDefined();
        });

        it("it should have a src property", function () {
          expect(image.get("src")).toBeDefined();
        });

        it("it should have a imageUrl property", function () {
          expect(image.get("imageUrl")).toBeDefined();
        });

        it("it should have a background property", function () {
          expect(image.get("background")).toBeDefined();
        });

        it("it should have an alt property", function () {
          expect(image.get("alt")).toBeDefined();
        });
        
        it("it should have a isVisible property", function () {
          expect(image.get("isVisible")).toBeDefined();
        });
        
        it("it should set imageUrl empty string by default", function () {
          expect(image.get("imageUrl")).toBe("");
        });
        
        it("it should set alt empty string by default", function () {
          expect(image.get("alt")).toBe("");
        });
        
        it("it should set background empty string by default", function () {
          expect(image.get("background")).toBe("");
        });
        
        it("it should set width 0 by default", function () {
          expect(image.get("width")).toBe(0);
        });
        
        it("it should set height 0 by default", function () {
          expect(image.get("height")).toBe(0);
        });
      });

      describe("changing width, height or background should affect on src property", function () {
        beforeEach(function () {
          image.set("imageUrl", "test");
        });
        it("width should affect on src", function () {
          image.set("width", 100);
          expect(image.get("src")).toMatch(/w=100/);
        });

        it("height should affect on src", function () {
          image.set("height", 100);
          expect(image.get("src")).toMatch(/h=100/);
        });

        it("background should affect on src", function () {
          image.set("background", "cccccc");
          expect(image.get("src")).toMatch(/bc=cccccc/);
        });
      });
    });

    describe("Given an Image Control", function () {
      var model1, model2,
            $element1, $element2,
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

        model1 = testAreaApp.ImageTest1;
        model2 = testAreaApp.ImageTest2;

        $element1 = nodeApp.find('[data-sc-id="ImageTest1"]');
        $element2 = nodeApp.find('[data-sc-id="ImageTest2"]');
        app = testAreaApp;
      });

      afterEach(function () {
        nodeApp.hide();
      });

      it("it should create the control when I execute Run", function () {
        expect(app.ImageTest1).toBeDefined();
        expect(app.ImageTest2).toBeDefined();
      });

      it("it should have the viewModel to be defined inside the model", function () {
        expect(model1.viewModel).toBeDefined();
        expect(model2.viewModel).toBeDefined();
      });

      it("it should change the height of the Control", function () {
        model1.set("height", "50");
        expect(model1.get("height")).toEqual("50");
        var index = $element1.attr("src").indexOf("h=50");
        expect(index).toBeGreaterThan(0);
      });

      it("it should change the width of the Control", function () {
        model1.set("width", "150");
        expect(model1.get("width")).toEqual("150");
        var index = $element1.attr("src").indexOf("w=150");
        expect(index).toBeGreaterThan(0);
      });

      it("it should change the imageUrl of the Control", function () {
        var value = "~/media/DE8EC2DC330444A98D271E8824BD5C76.ashx";
        model1.set("imageUrl", value);
        expect(model1.get("imageUrl")).toEqual(value);
        var index = $element1.attr("src").indexOf(value);
        expect(index).toBe(0);
      });
      
      it("it should change the isVisible of the Control", function () {
        model1.set("isVisible", false);
        expect(model1.get("isVisible")).toEqual(false);
        expect($element1.is(":visible")).toEqual(false);
      });

      it("it should create an Alt text for this Control", function () {
        var value = "Alt text";
        model1.set("alt", value);
        expect(model1.get("alt")).toEqual(value);
        var index = $element1.attr("alt").indexOf(value);
        expect(index).toBe(0);
      });  

      it("it should set imageUrl property from the data-image-src attribute after initialization", function () {
        expect(model1.get("imageUrl")).toBe($element1.data("image-src"));
        expect(model2.get("imageUrl")).toBe($element2.data("image-src"));
      });
      
      it("it should set alt property from the alt attribute after initialization", function () {
        expect(model1.get("alt")).toBe($element1.attr("alt"));
        expect(model2.get("alt")).toBe($element2.attr("alt"));
      });
      
      it("it should set width property from the data-sc-width attribute after initialization", function () {
        var index1 = $element1.data("sc-width") ? $element1.data("sc-width").indexOf(model1.get("width")) : 0,
            index2 = $element2.data("sc-width") ? $element2.data("sc-width").indexOf(model2.get("width")) : 0;
        expect(index1).toBe(0);
        expect(index2).toBe(0);
      });
      
      it("it should set height property from the data-sc-height attribute after initialization", function () {
        var index1 = $element1.data("sc-height") ? $element1.data("sc-height").indexOf(model1.get("height")) : 0,
            index2 = $element2.data("sc-height") ? $element2.data("sc-height").indexOf(model2.get("height")) : 0;
        expect(index1).toBe(0);
        expect(index2).toBe(0);
      });



    });
  };

  runTests(jasmineEnv, setupTests, "Image.htm");
});