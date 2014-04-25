require(["jasmineEnv", "/-/speak/v1/business/SmartPanel.js"], function (jasmineEnv) {
  
  var setupTests = function (testAreaEl) {
    "use strict";
    
    describe("Given a SmartPanel model", function () {
      var smartPanel = new Sitecore.Definitions.Models.SmartPanel();

      describe("when I create a SmartPanel model", function () {
        it("it should have a dimensions property", function () {
            expect(smartPanel.get("dimensions")).toBeDefined();
        });

        it("it should have a position property", function () {
            expect(smartPanel.get("position")).toBeDefined();
        });

        it("it should have a offsetBottom property", function () {
            expect(smartPanel.get("offsetBottom")).toBeDefined();
        });

        it("it should have a offsetTop property", function () {
            expect(smartPanel.get("offsetTop")).toBeDefined();
        });
        
        it("it should have an isOpen property", function () {
          expect(smartPanel.get("isOpen")).toBeDefined();
        });

        it("it should have isVisible property", function () {
          expect(smartPanel.get("isVisible")).toBeDefined();
        });
        
        it("it should set isVisible to true by default", function () {
          expect(smartPanel.get("isVisible")).toBe(true);
        });
        
        it("it should set isOpen to false by default", function () {
          expect(smartPanel.get("isOpen")).toBe(false);
        });
        
        it("it should set dimensions to normal by default", function () {
          expect(smartPanel.get("dimensions")).toBe("normal");
        });
        
        it("it should set position to right by default", function () {
          expect(smartPanel.get("position")).toBe("right");
        });
        
        it("it should set offsetTop to 0 by default", function () {
          expect(smartPanel.get("offsetTop")).toBe(0);
        });
        
        it("it should set offsetBottom to 0 by default", function () {
          expect(smartPanel.get("offsetBottom")).toBe(0);
        });

      });
    });


    describe("Given an SmartPanel Control", function () {
      var model1, model2, model3, $element1, $element2, $element3, testAreaApp, app, appNumber = 0, nodeApp;

      beforeEach(function () {
        nodeApp = testAreaEl.clone(true);
        nodeApp.attr("id", testAreaEl.attr("id") + appNumber);

        nodeApp.appendTo($("body"));
        testAreaApp = _sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
        appNumber++;
        
        model1 = testAreaApp.SmartPanelTest1;
        model2 = testAreaApp.SmartPanelTest2;
        model3 = testAreaApp.SmartPanelTest3;
        
        $element1 = nodeApp.find('[data-sc-id="SmartPanelTest1"]');
        $element2 = nodeApp.find('[data-sc-id="SmartPanelTest2"]');
        $element3 = nodeApp.find('[data-sc-id="SmartPanelTest3"]');
        
        app = testAreaApp;
      });

      afterEach(function () {
        nodeApp.hide();
      });
        
      it("it should create the control when I execute Run", function () {
        expect(app.SmartPanelTest1).toBeDefined();
        expect(app.SmartPanelTest2).toBeDefined();
        expect(app.SmartPanelTest3).toBeDefined();
      });

      it("it should trigger the open event", function () {
        app.trigger("open:SmartPanelTest1");
        expect(model1.get("isOpen")).toEqual(true);
      });
   
      it("it should have the viewModel to be defined inside the model", function () {
        expect(model1.viewModel).toBeDefined();
      });

      it("it should trigger the close event", function () {
        app.trigger("close:SmartPanelTest1");
        expect(model1.get("isOpen")).toEqual(false);
      });
      
      it("it should set the Element width to 500px when Dimensions=Large and Position=Left", function () {
        expect(model1.get("dimensions")).toEqual("large");
        expect($element1.css("width")).toEqual("500px");
      });
      
      it("it should set the Element width to 400px when Dimensions=Normal and Position=Right", function () {
        expect(model3.get("dimensions")).toEqual("normal");
        expect($element3.css("width")).toEqual("400px");
      }); 
        
      it("it should set the Element height to 300px when Dimensions=Small and Position=Bottom", function () {
        expect(model2.get("dimensions")).toEqual("small");
        expect($element2.css("height")).toEqual("300px");
      });

      it("it should set the Element top:100px when Position=Left OffsetTop=100", function () {            
        expect($element3.css("top")).toEqual("100px");
      });
      
      it("it should set the Element bottom:200px when Position=Left OffsetBottom=200", function () {
        expect($element3.css("bottom")).toEqual("200px");
      });

      it("it should change offsetTop property", function () {
        model3.set("offsetTop", 50);
        expect($element3.css("top")).toEqual("50px");
      });
      
      it("it should set to the Element property Position=Left", function () {
        expect($element3.css("left")).toEqual("-" + $element3.css("width"));
      });

      it("it should have the close method to be defined inside viewModel", function () {
        model1.viewModel.close();
        expect(model1.get("isOpen")).toEqual(false);
      });
      
      it("it should have the open method to be defined inside viewModel", function () {
        model1.viewModel.open();
        expect(model1.get("isOpen")).toEqual(true);
      });
     
      it("it should have the toggle method to be defined inside viewModel", function () {
        var isOpen = model1.get("isOpen");
        model1.viewModel.toggle();
        expect(model1.get("isOpen")).toEqual(!isOpen);
      });
      
      it("it should have the collapse method to be defined inside viewModel", function () {
        model3.viewModel.collapse();
        expect(model3.get("isVisible")).toEqual(false);
      });
      
      it("it should have the expand method to be defined inside viewModel", function () {
        model2.viewModel.expand();
        expect(model2.get("isVisible")).toEqual(true);
      });
        
      it("it should not appear when I set the isOpen property", function () {         
        app.trigger("open:SmartPanelTest1");
        expect(model1.get("isOpen")).toEqual(true);
        expect(model1.get("isVisible")).toEqual(true);
        model1.set("isOpen", false);
        expect(model1.get("isOpen")).toEqual(false);
        expect(model1.get("isVisible")).toEqual(false);
        expect($element1.is(":visible")).toEqual(false);
      });
        
      it("it should close the smartpanel when I click close button", function () {
        app.trigger("open:SmartPanelTest1");
        $element1.find(".sc-smartpanel-close").click();
        expect(model1.get("isOpen")).toEqual(false);
        expect(model1.get("isVisible")).toEqual(false);
        expect($element1.is(":visible")).toEqual(false);
      });


    });
  };

  runTests(jasmineEnv, setupTests, "SmartPanel.htm");
});