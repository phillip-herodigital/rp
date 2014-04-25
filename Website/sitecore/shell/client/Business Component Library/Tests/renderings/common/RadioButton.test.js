/// <reference path="../../jasmine.ui.runner.test.js" />
/// <reference path="../../../Sitecore/Repository/Layouts/Renderings/Common/RadioButtons/RadioButton.js" />
require(["jasmineEnv", "/-/speak/v1/business/radiobutton.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a RadioButton model", function ()
    {
    var radioButton = new Sitecore.Definitions.Models.RadioButton();

    describe("when I create a RadioButton model", function() {

      it("it should have a 'name' attribute which holds the name of the radio button group", function ()
      {
        expect(radioButton.get("name")).toBeDefined();
      });
      
      it("it should have a 'text' attribute", function () {
        expect(radioButton.get("text")).toBeDefined();
      });
      
      it("it should have a 'value' attribute which contains the name of the radio button group, if the radio button is checked", function ()
      {
        expect(radioButton.get("value")).toBeDefined();
      });

      it("it should have a 'isChecked' attribute that determines if the radio button is checked or not", function ()
      {
        expect(radioButton.get("isChecked")).toBeDefined();
      });

      it("it should have a 'isEnabled' attribute that determines if the radio button is enabled or not", function ()
      {
        expect(radioButton.get("isEnabled")).toBeDefined();
      });

      it("it should have a isVisible property that determines if the hyperlink is visible or not", function ()
      {
        expect(radioButton.get("isVisible")).toBeDefined();
      });

      it("it should set isVisible to true by default", function ()
      {
        expect(radioButton.get("isVisible")).toBe(true);
      });

      it("it should set isEnabled true by default", function ()
      {
        expect(radioButton.get("isEnabled")).toBe(true);
      });
      
      it("it should set isChecked false by default", function () {
        expect(radioButton.get("isChecked")).toBe(false);
      });

      it("it should have a toggle function that either shows or hides the hyperlink depending on the isVisible property", function ()
      {
        expect(radioButton.toggle).toBeDefined();
      });
      
      it("it should set name to empty value by default", function () {
        expect(radioButton.get("name")).toBe("");
      });
      
      it("it should set text to empty value by default", function () {
        expect(radioButton.get("text")).toBe("");
      });
    });

    
    describe("when I toggle a visible radio button", function ()
    {
      it("it should set isVisible is false", function () {
        var b = new Sitecore.Definitions.Models.RadioButton();
        b.toggle();
        
        expect(b.get("isVisible")).toBe(false);
      });
    });

    describe("when I toggle an invisible radio button", function ()
    {
      it("it should set isVisible is true", function () {
        var b = new Sitecore.Definitions.Models.RadioButton();
        b.set("isVisible", false);
        b.toggle();
        
        expect(b.get("isVisible")).toBe(true);
      });
    });
    });
    

    describe("Given a RadioButton Control", function () {
      var model1, model2, model3, model4,
          $element1, $element2, $element3, $element4,
            testAreaApp, app, appNumber = 0, nodeApp;
      
      beforeEach(function () {
        nodeApp = testAreaEl.clone(true);
        nodeApp.attr("id", testAreaEl.attr("id") + appNumber);

        nodeApp.appendTo($("body"));
        testAreaApp = _sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
        appNumber++;

        model1 = testAreaApp.RadioButtonTest1;
        model2 =  testAreaApp.RadioButtonTest2;
        model3 = testAreaApp.RadioButtonTest3;
        model4 = testAreaApp.RadioButtonTest4;
        $element1 = nodeApp.find('[data-sc-id="RadioButtonTest1"]');
        $element2 = nodeApp.find('[data-sc-id="RadioButtonTest2"]');
        $element3 = nodeApp.find('[data-sc-id="RadioButtonTest3"]');
        $element4 = nodeApp.find('[data-sc-id="RadioButtonTest4"]');

        app = testAreaApp;
      });

      it("it should create the Control when I execute Run", function () {
        expect(testAreaApp.RadioButtonTest1).toBeDefined();
        expect(testAreaApp.RadioButtonTest2).toBeDefined();
        expect(testAreaApp.RadioButtonTest3).toBeDefined();
        expect(testAreaApp.RadioButtonTest4).toBeDefined();
      });
      
      it("it should have the viewModel to be defined inside the model", function () {
        expect(model1.viewModel).toBeDefined();
        expect(model2.viewModel).toBeDefined();
        expect(model3.viewModel).toBeDefined();
        expect(model4.viewModel).toBeDefined();
      });

      it("when I set the isVisible property is should not appear", function () {
        var value = false;
        expect($element1.is(":visible")).toEqual(!value);
        model1.set("isVisible", value);
        expect(model1.get("isVisible")).toEqual(value);
        expect($element1.is(":visible")).toEqual(value);
      });

      it("it should change the text value of the HTML element", function () {
        expect(model1.get("text")).toEqual("Option 1");
        model1.set("text", "new value");
        expect(model1.get("text")).toEqual("new value");
        var index = $element1.find(".sc-radiobutton-label").html().indexOf("new value");
        expect(index).toBe(0);
      });

      it("it should set the Element isEnabled property to true", function () {
        expect($element3.find(".sc-radiobutton-input").is(":disabled")).toEqual(true);
        expect(model3.get("isEnabled")).toEqual(false);
        model3.set("isEnabled", true);
        expect(model3.get("isEnabled")).toEqual(true);
        expect($element3.find(".sc-radiobutton-input").is(":disabled")).toEqual(false);
      });
      
      it("it should set value property to 10", function () {
        expect(model3.get("value")).toEqual("3");
        model3.set("value", "5");
        expect(model3.get("value")).toEqual("5");
      });
      
      it("it should change the isChecked value of the HTML element to false", function () {
        model1.set("isChecked", false);
        expect($element1.find(".sc-radiobutton-input").is(":checked")).toBe(false);
        expect(model1.get("isChecked")).toEqual(false);
      });
      
      it("it should set name property to name attribute from the .sc-radiobutton-input element after initialization", function () {
        expect($element1.find(".sc-radiobutton-input").attr("name")).toBe("rb2");
        expect(model1.get("name")).toEqual("rb2");
      });
      
      it("it should set value property to value of the element .sc-radiobutton-input after initialization", function () {
        expect($element1.find(".sc-radiobutton-input").val()).toBe("1");
        expect(model1.get("value")).toEqual("1");
      });
      
      it("it should set text property to value of the label after initialization", function () {
        expect($element1.find(".sc-radiobutton-label").html()).toBe("Option 1");
        expect(model1.get("text")).toEqual("Option 1");
      });

    });

  };

  runTests(jasmineEnv, setupTests, "RadioButton.htm");
});
