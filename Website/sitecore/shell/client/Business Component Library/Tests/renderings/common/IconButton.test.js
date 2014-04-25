require(["jasmineEnv", "/-/speak/v1/business/IconButton.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a IconButton model", function () {
      var iconButton = new Sitecore.Definitions.Models.IconButton();

      describe("when I create an IconButton model", function () {
        it("it should have a isEnabled property that determines if the button is disabled or not", function () {
          expect(iconButton.get("isEnabled")).toBeDefined();
        });

        it("it should have a isVisible property that determines if the button is visible or not", function () {
          expect(iconButton.get("isVisible")).toBeDefined();
        });

        it("it should set isVisible to true by default", function () {
          expect(iconButton.get("isVisible")).toBe(true);
        });

        it("it should set isEnabled true by default", function () {

          expect(iconButton.get("isEnabled")).toBe(true);
        });

        it("it should have a toggle function that either shows or hides the button depending on the isVisible property", function () {
          expect(iconButton.toggle).toBeDefined();
        });

        it("it should have a imageUrl property that determines the div background-image", function () {
            expect(iconButton.get("imageUrl")).toBeDefined();
        });

        it("it should have a backgroundPosition property that determines the image background-position style (used with sprite images) ", function () {
          expect(iconButton.get("backgroundPosition")).toBeDefined();
        });
      });

      describe("when I toggle a visible button", function () {
        it("it should set isVisible is false", function () {
          var b = new Sitecore.Definitions.Models.IconButton();
          b.toggle();

          expect(b.get("isVisible")).toBe(false);
        });
      });

      describe("when I toggle an invisible button", function () {
        it("it should set isVisible is true", function () {
          var b = new Sitecore.Definitions.Models.IconButton();
          b.set("isVisible", false);
          b.toggle();

          expect(b.get("isVisible")).toBe(true);
        });
      });
    });

    describe("Given an IconButton Control", function () {
      var model;
      var $element;

      it("it should create the Control when I execute Run", function () {
        var testArea = _sc.Factories.createApp(testAreaEl.attr("id"));
        expect(testArea.IconButtonTest).toBeDefined();

        model = testArea.IconButtonTest;
        $element = testAreaEl.find(".sc-icon-button");
      });

      it("it should change the div background-image", function () {
          model.set("imageUrl", "ApplicationsV2/16x16/text_bold.png");
          expect(model.get("imageUrl")).toEqual("/~/icon/applicationsv2/16x16/text_bold.png");
        var index = $element.find(".sc-icon-button-image").css("background-image").indexOf("icon/applicationsv2/16x16/text_bold.png");
        expect(index).toBeGreaterThan(0);
      });

      it("it should change the div background-position", function () {
        model.set("backgroundPosition", "0px 0px");
        expect(model.get("backgroundPosition")).toEqual("0px 0px");
        expect($element.find(".sc-icon-button-image").css("background-position")).toEqual("0px 0px");
      });

    });
  };

  runTests(jasmineEnv, setupTests, "IconButton.htm");
});