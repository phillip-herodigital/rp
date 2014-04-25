/// <reference path="../../vendors/jasmine-standalone-1.0.0/jasmine.js" />
/// <reference path="../../jasmine.ui.runner.test.js" />
/// <reference path="../../../Sitecore/Repository/Layouts/Renderings/Common/Buttons/Button.js" />

require(["jasmineEnv", "/-/speak/v1/business/dropDownButton.js"], function (jasmineEnv) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a Button model", function () {
      var dropDownButton = new Sitecore.Definitions.Models.DropDownButton();

      describe("when I create a DropDownButton model", function () {      
        it("it should have an text property", function () {
          expect(dropDownButton.get("text")).toBeDefined();
        });
        
        it("it should set text to null by default", function () {
          expect(dropDownButton.get("text")).toBe(null);
        });
        
        it("it should have an imageUrl property", function () {
          expect(dropDownButton.get("imageUrl")).toBeDefined();
        });

        it("it should set imageUrl to empty string by default", function () {
          expect(dropDownButton.get("imageUrl")).toBe("");
        });
        
        it("it should have a backgroundPosition property", function () {
          expect(dropDownButton.get("backgroundPosition")).toBeDefined();
        });

        it("it should set backgroundPosition to 'center' by default", function () {
          expect(dropDownButton.get("backgroundPosition")).toBe("center");
        });
        
        it("it should have an isOpen property", function () {
          expect(dropDownButton.get("isOpen")).toBeDefined();
        });

        it("it should set isOpen to 'false' by default", function () {
          expect(dropDownButton.get("isOpen")).toBe(false);
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

          model1 = testAreaApp.DropDownButtonTest1;
          model2 = testAreaApp.DropDownButtonTest2;
          model3 = testAreaApp.DropDownButtonTest3;

          $element1 = nodeApp.find('[data-sc-id="DropDownButtonTest1"]');
          $element2 = nodeApp.find('[data-sc-id="DropDownButtonTest2"]');
          $element3 = nodeApp.find('[data-sc-id="DropDownButtonTest3"]'); 
          app = testAreaApp;
        });

        afterEach(function () {
         // nodeApp.hide();
        });

        it("it should create the control when I execute Run", function () {
          expect(app.DropDownButtonTest1).toBeDefined();
          expect(app.DropDownButtonTest2).toBeDefined();
          expect(app.DropDownButtonTest3).toBeDefined();
          
        });

        it("it should have the viewModel to be defined inside the model", function () {
          expect(model1.viewModel).toBeDefined();
          expect(model2.viewModel).toBeDefined();
          expect(model3.viewModel).toBeDefined();
        });
        
        it("it should set the text property from button label after initialization inside the model", function () {
          expect(model1.get("text")).toBe($element1.find(".sc-dropdownbutton-text").html());
          expect(model2.get("text")).toBe($element2.find(".sc-dropdownbutton-text").html());
          expect(model3.get("text")).toBe($element3.find(".sc-dropdownbutton-text").html());
        });

        it("it should set the imageUrl property to '/sitecore/shell/client/Speak/Assets/img/sc-sprite.png' after initialization inside the model", function () {
          expect(model3.get("imageUrl")).toBe("/sitecore/shell/client/Speak/Assets/img/sc-sprite.png");
        });
        
        it("it should set the backgroundPosition property from html of the button after initialization inside the model", function () {
          expect(model3.get("backgroundPosition")).toBe("-32px -34px");
        });
        
        it("it should change the text value of the HTML element", function () {
          model1.set("text", "new value");
          expect(model1.get("text")).toEqual("new value");
          var index = $element1.find('.sc-dropdownbutton-text').html().indexOf("new value");
          expect(index).toBe(0);
        });
        
        it("it should set the Element backgroundPosition property to '-32px -33px'", function () {
          model1.set("backgroundPosition", "-32px -33px");
          expect(model1.get("backgroundPosition")).toEqual("-32px -33px");
        });
        
        it("it should set the Element imageUrl property to '/sitecore/shell/client/Speak/Assets/img/sc-sprite.png'", function () {
          model1.set("imageUrl", "/sitecore/shell/client/Speak/Assets/img/sc-sprite.png");
          expect(model1.get("imageUrl")).toEqual("/sitecore/shell/client/Speak/Assets/img/sc-sprite.png");
        });
        
        it("it should set the Element isOpen property to true", function () {
          model1.set("isOpen", true);
          expect(model1.get("isOpen")).toEqual(true);
          expect($element1.find('.sc-dropdownbutton-contentpanel').is(":visible")).toBe(true);
          expect($element1.hasClass("up")).toBe(true);
          expect($element1.find(".btn").hasClass("up")).toBe(true);
          expect($element1.find(".sc-dropdownbutton-chevron").hasClass("up")).toBe(true);
        });
        
        it("it should have the toggleEnable method which should add disabled attribute in the DOM inside viewModel, if isEnabled property equals false", function () {
          model1.set("isEnabled", false);
          model1.viewModel.toggleEnable();
          expect($element1.find(".btn").attr("disabled")).toBe("disabled");
        });
        
        it("it should have the toggleEnable method which should remove disabled attribute in the DOM inside viewModel, if isEnabled property equals true", function () {
          model1.set("isEnabled", true);
          model1.viewModel.toggleEnable();
          expect($element1.find(".btn").is(":disabled")).toBe(false);
        });

        it("it should have the toogle method to change isOpen property inside viewModel", function () {
          model1.set("isOpen", true);
          model1.viewModel.toggle();
          
          waitsFor(function () {
           
            return $element1.find('.sc-dropdownbutton-contentpanel').is(":visible");
          }, "dropdown should be visible", 750);
          
          runs(function () {
            expect($element1.find('.sc-dropdownbutton-contentpanel').is(":visible")).toBe(false);
            expect($element1.hasClass("up")).toBe(false);
            expect($element1.find(".btn").hasClass("up")).toBe(false);
            expect($element1.find(".sc-dropdownbutton-chevron").hasClass("up")).toBe(false);
            expect(model1.get("isOpen")).toEqual(false);
          });

        });
        
        it("it should have the open method to change isOpen property if isEnabled property equals true inside viewModel", function () {
          // if isEnabled property equals true
          model1.viewModel.open();
          expect(model1.get("isOpen")).toBe(true);
          // if isEnabled property equals false
          model2.set("isEnabled", false);
          model2.viewModel.open();
          expect(model2.get("isOpen")).toBe(false);
        });
        
        it("it should have the close method to change isOpen property if isEnabled property equals true inside viewModel", function () {
          model1.viewModel.open();
          // if isEnabled property equals true
          model1.viewModel.close();
          expect(model1.get("isOpen")).toBe(false);
          // if isEnabled property equals false
          model2.viewModel.open();
          model2.set("isEnabled", false);
          model2.viewModel.close();
          expect(model2.get("isOpen")).toBe(true);
        });
        
        it("it should have the expand method to slideDown dropdown content panel in 50ms inside viewModel", function () {
          model1.viewModel.expand();
          setTimeout(function () {
            expect($element1.find('.sc-dropdownbutton-contentpanel').is(":visible")).toBe(true);
          }, 50);
        });
        
        it("it should have the collapse method to slideUp dropdown content panel in 50ms inside viewModel", function () {
          model1.viewModel.open();
          model1.viewModel.collapse();
          setTimeout(function () {
            expect($element1.find('.sc-dropdownbutton-contentpanel').is(":visible")).toBe(false);
          }, 50);
        });
        

      });


    });

  };

  runTests(jasmineEnv, setupTests, "DropDownButton.htm");
});