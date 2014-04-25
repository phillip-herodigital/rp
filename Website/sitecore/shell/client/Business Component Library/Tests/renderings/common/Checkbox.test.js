require(["jasmineEnv", "/-/speak/v1/business/checkbox.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a CheckBox model", function () {
      var checkBoxControl = new Sitecore.Definitions.Models.CheckBox();

      describe("when I create a CheckBox model", function () {
        it("it should have a isVisible property that determines if the CheckBox is visible or not", function () {
          expect(checkBoxControl.get("isVisible")).toBeDefined();
        });

        it("it should set isVisible to true by default", function () {
          expect(checkBoxControl.get("isVisible")).toBe(true);
        });
        
        it("it should have isEnabled property that determines if the Checkbox is enabled or not", function () {
          expect(checkBoxControl.get("isEnabled")).toBeDefined();
        });

        it("it should set isEnable to true by default", function () {
          expect(checkBoxControl.get("isEnabled")).toBe(true);
        });
        
        it("it should have isChecked property that determines if the Checkbox is checked or not", function () {
          expect(checkBoxControl.get("isChecked")).toBeDefined();
        });
        
        it("it should set isReadOnly to false by default", function () {
          expect(checkBoxControl.get("isChecked")).toBe(false);
        });

        it("it should have text property", function () {
          expect(checkBoxControl.get("text")).toBeDefined();
        });

        it("it should set text to empty string by default", function () {
          expect(checkBoxControl.get("text")).toBe("");
        });
        
        it("it should have value property", function () {
          expect(checkBoxControl.get("value")).toBeDefined();
        });

        it("it should set value to empty string by default", function () {
          expect(checkBoxControl.get("value")).toBe("");
        });
      });
      


      describe("Given a Checkbox Control", function () {
        var model1, model2, model3,
            $element1, $element2, $element3,
              testAreaApp, app, appNumber = 0, nodeApp;

        beforeEach(function () {
          nodeApp = testAreaEl.clone(true);
          nodeApp.attr("id", testAreaEl.attr("id") + appNumber);

          nodeApp.appendTo($("body"));
          testAreaApp = _sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
          appNumber++;

          model1 = testAreaApp.CheckboxTest1;
          model2 = testAreaApp.CheckboxTest2;
          model3 = testAreaApp.CheckboxTest3;
          $element1 = nodeApp.find('[data-sc-id="CheckboxTest1"]');
          $element2 = nodeApp.find('[data-sc-id="CheckboxTest2"]');
          $element3 = nodeApp.find('[data-sc-id="CheckboxTest3"]');
          app = testAreaApp;
        });

        it("it should create the Control when I execute Run", function () {
          expect(testAreaApp.CheckboxTest1).toBeDefined();
          expect(testAreaApp.CheckboxTest2).toBeDefined();
          expect(testAreaApp.CheckboxTest3).toBeDefined();
        });

        it("it should have the viewModel to be defined inside the model", function () {
          expect(model1.viewModel).toBeDefined();
          expect(model2.viewModel).toBeDefined();
          expect(model3.viewModel).toBeDefined();
        });

        it("when I set the isVisible property is should not appear", function () {
          var value = false;
          expect($element1.is(":visible")).toEqual(!value);
          model1.set("isVisible", value);
          expect(model1.get("isVisible")).toEqual(value);
          expect($element1.is(":visible")).toEqual(value);
        });

        it("it should change the text value of the HTML element", function () {
          expect(model2.get("text")).toEqual("Label Text");
          model2.set("text", "new value");
          expect(model2.get("text")).toEqual("new value");
          var index = $element2.find("span").html();
          expect(index).toBe("new value");
        });

        it("it should set the Element isEnabled property to true", function () {
          expect($element3.find("input").is(":disabled")).toEqual(true);
          expect(model3.get("isEnabled")).toEqual(false);
          model3.set("isEnabled", true);
          expect(model3.get("isEnabled")).toEqual(true);
          expect($element3.find("input").is(":disabled")).toEqual(false);
        });
        
        it("it should change the isChecked value of the HTML element to false", function () {
          model1.set("isChecked", false);
          expect($element1.find("input").is(":checked")).toBe(false);
          expect(model1.get("isChecked")).toEqual(false);
        });

        it("it should set value property to value of the element after initialization", function () {
          expect($element2.find("input").val()).toBe("1");
          expect(model2.get("value")).toEqual("1");
        });

      });
 

    });
  };

  runTests(jasmineEnv, setupTests, "CheckBox.htm");
});
