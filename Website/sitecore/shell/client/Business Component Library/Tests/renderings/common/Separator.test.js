require(["jasmineEnv", "/-/speak/v1/business/separator.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a Separator model", function () {
      var separatorControl = new Sitecore.Definitions.Models.Separator();
      describe("when I create a Separator model", function () {
        it("it should have a isVisible property", function () {
          expect(separatorControl.get("isVisible")).toBeDefined();
        });

      });
    });

    describe("Given a Button Control", function () {
      var model1,
          model2,
          $element1,
          $element2;

      it("it should create the Control when I execute Run", function () {
        var testArea = _sc.Factories.createApp(testAreaEl.attr("id"));
        expect(testArea.SeparatorTest1).toBeDefined();
        expect(testArea.SeparatorTest2).toBeDefined();
        model1 = testArea.SeparatorTest1;
        model2 = testArea.SeparatorTest2;
        $element1 = testAreaEl.find('[data-sc-id="SeparatorTest1"]');
        $element2 = testAreaEl.find('[data-sc-id="SeparatorTest2"]');
      });

      it("when I set the isVisible property to false it should not appear", function () {
        var value = false;
        expect($element1.is(":visible")).toEqual(!value);
        expect(model1.get("isVisible")).toEqual(!value);
        model1.set("isVisible", value);
        expect(model1.get("isVisible")).toEqual(value);
        expect($element1.is(":visible")).toEqual(value);
      });
      
      it("when I set the isVisible property to true it should appear", function () {
        var value = false;
        expect($element2.is(":visible")).toEqual(value);
        expect(model2.get("isVisible")).toEqual(value);
        model1.set("isVisible", !value);
        expect(model1.get("isVisible")).toEqual(!value);
        expect($element1.is(":visible")).toEqual(!value);
      });

    });


  };

  runTests(jasmineEnv, setupTests, "Separator.html");
});