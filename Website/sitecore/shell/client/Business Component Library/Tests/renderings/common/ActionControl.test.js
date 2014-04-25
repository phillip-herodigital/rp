/// <reference path="../../jasmine.ui.runner.test.js" />
/// <reference path="../../../Sitecore/Repository/Layouts/Renderings/Common/ActionControls/ActionControl.js" />

require(["jasmineEnv","sitecore", "/-/speak/v1/business/actioncontrol.js"], function (jasmineEnv, Sitecore) {
  var setupTests = function (testAreaEl) {
    "use strict";
    var appNumber = 0;
    
    describe("Given a ActionControl model", function () {
      var actionControl = new Sitecore.Definitions.Models.ActionControl();

      describe("when I create a ActionControl model", function () {
        it("it should have a 'text' property which holds the label", function () {
          expect(actionControl.get("text")).toBeDefined();
        });

        it("it should have a 'isVisible' property that determines if the ActionControl is visible or not", function () {
          expect(actionControl.get("isVisible")).toBeDefined();
        });

        it("it should have a 'isOpen' property that determines if the panel is open or not", function () {
          expect(actionControl.get("isOpen")).toBeDefined();
        });

        it("it should have a 'actions' collections", function () {
          expect(actionControl.get("actions")).toBeDefined();
        });

        it("it should have a 'favorites' collections", function () {
          expect(actionControl.get("favorites")).toBeDefined();
        });

        it("it should set 'isVisible' to true by default", function () {
          expect(actionControl.get("isVisible")).toBe(true);
        });

        it("it should set 'isOpen' false by default", function () {
          expect(actionControl.get("isOpen")).toBe(false);
        });

        it("it should have an empty 'actions' collection by default", function () {
          expect(actionControl.get("actions").length).toBe(0);
        });

        it("it should have an empty 'favorites' collection by default", function () {
          expect(actionControl.get("favorites").length).toBe(0);
        });

        it("it should have a 'toggle' function that either shows or hides the ActionControl depending on the isVisible property", function () {
          expect(actionControl.toggle).toBeDefined();
        });

        it("it should have a toggle function that either shows or hides the ActionControl depending on the isVisible property", function () {
          expect(actionControl.toggle).toBeDefined();
        });
      });

      describe("when I toggle a visible ActionControl", function () {
        it("it should set 'isVisible' is false", function () {
          var a = new Sitecore.Definitions.Models.ActionControl();
          a.toggle();

          expect(a.get("isVisible")).toBe(false);
        });
      });

      describe("when I toggle an invisible ActionControl", function () {
        it("it should set 'isVisible' is true", function () {
          var a = new Sitecore.Definitions.Models.ActionControl();
          a.set("isVisible", false);
          a.toggle();

          expect(a.get("isVisible")).toBe(true);
        });
      });
    });
    
    describe("Given an Application with appropriate html template", function () {
      var model, $element, testAreaApp, m, $e, a,nodeApp;

      beforeEach(function () {
        nodeApp = testAreaEl.clone(true);
        nodeApp.attr("id", testAreaEl.attr("id") + appNumber);

        nodeApp.appendTo($("body"));
        testAreaApp = _sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
        appNumber++;
        model = testAreaApp.ActionControlTest;
        $element = nodeApp.find(".sc-actioncontrol");
        m = model;
        $e = $element;
        a = testAreaApp;
      });

      afterEach(function () {
        //  testAreaApp.destroy();
        //          a = null;
        //          m = null;
        //          $e = null;
       // nodeApp.hide();
      });

      it("it should create the Control when I execute Run", function () {
        expect(a.ActionControlTest).toBeDefined();
      });
      
      it("it should have the viewModel to be defined inside the model", function () {
        expect(m.viewModel).toBeDefined();
      });
      
      it("it should have the hide method to be defined inside viewModel", function () {
        expect(m.viewModel.hide).toBeDefined();
      });
      
      it("it should have the show method to be defined inside viewModel", function () {
        expect(m.viewModel.show).toBeDefined();
      });
      
      it("it should have the toggleIsOpen method to be defined inside viewModel", function () {
        expect(m.viewModel.toggleIsOpen).toBeDefined();
      });
      
      it("it should show menu of the Action Control when the toggleIsOpen method was called", function () {
        expect($e.find(".dropdown-menu").is(":visible")).toBe(false);
        m.viewModel.toggleIsOpen();
        expect($e.find(".dropdown-menu").is(":visible")).toBe(true);
      });
      
      it("it should show menu of the Action Control when the action button was clicked", function () {
        expect($e.find(".dropdown-menu").is(":visible")).toBe(false);
        var btn = $e.find("[role='menuitem'] a.btn");
        btn.click();
        expect($e.find(".dropdown-menu").is(":visible")).toBe(true);
      });
      
      it("it should hide menu of the Action Control when user clicks outside of the menu", function () {
        m.viewModel.toggleIsOpen();
        expect($e.find(".dropdown-menu").is(":visible")).toBe(true);
        $e.find(".sc-actionpanel-popup").click();
        expect($e.find(".dropdown-menu").is(":visible")).toBe(false);
      });
      
      it("it should hide/show the Action Control when I change isVisible property to false/true", function () {
        var value = false;
        m.set("isVisible", value);
        expect(m.get("isVisible")).toEqual(value);
        expect($e.is(":visible")).toEqual(value);

        m.set("isVisible", !value);
        expect(m.get("isVisible")).toEqual(!value);
        expect($e.is(":visible")).toEqual(!value);
      });

      it("it should add one more action to the favorites array of the Action Control, when user clicks on the star icon of the action, that is not in the favorite state", function () {
        expect(m.get("favorites").length).toBe(1);
        var favIcon = $e.find(".favorite-icon").eq(4);
        favIcon.trigger("click");
        console.log(favIcon);
        console.log(m.get("favorites"));
        waitsFor(function () {
          return m.get("favorites").length === 2;
        }, "favs array should be incremented", 1000);
        
        runs(function () {
          expect(m.get("favorites").length).toBe(2);
        });
        
      });
      
      it("it should have the star icon not to be selected", function () {
        var favIcon = $e.find(".favorite-icon").eq(4);
        expect(favIcon.hasClass("selected")).toBe(false);
      });

      it("it should change the star icon class, when user clicks on the star icon of the action", function () {
        var favIcon = $e.find(".favorite-icon").eq(4);
        expect(favIcon.hasClass("selected")).toBe(false);
        favIcon.trigger("click");
        expect(favIcon.hasClass("selected")).toBe(true);
      });

      it("it should reset the star icon class, when user clicks on the star icon of the action 2 times", function () {
        var favIcon = $e.find(".favorite-icon").eq(4);
        favIcon.trigger("click");
        expect(favIcon.hasClass("selected")).toBe(true);
        favIcon.trigger("click");
        expect(favIcon.hasClass("selected")).toBe(false);
      });
      
      it("it should add new favorite button before action button, when user clicks on the star icon of the action, that is not in the favorite state", function () {
        expect($e.find(".btn").length).toBe(2);
        var favIcon = $e.find(".favorite-icon").eq(4);
        favIcon.trigger("click");
        expect($e.find(".btn").length).toBe(3);
      });

        //TODO: investigate and fix this!      
//      it("it should call the 'toggleIsOpen' method when the action button was clicked", function () {
//        spyOn(m.viewModel, 'toggleIsOpen');
//        var btn = $e.find("[role='menuitem'] a.btn");
//        btn.click();
//        expect(m.viewModel.toggleIsOpen).toHaveBeenCalled();
//      });

      it("it should have the invokeAction method to be defined inside viewModel", function () {
        expect(m.viewModel.invokeAction).toBeDefined();
      });
      it("it should have the invokeFavorite method to be defined inside viewModel", function () {
        expect(m.viewModel.invokeFavorite).toBeDefined();
      });
      it("it should have the getAction method to be defined inside viewModel", function () {
        expect(m.viewModel.getAction).toBeDefined();
      });
      it("it should have the updateFavorites method to be defined inside viewModel", function () {
        expect(m.viewModel.updateFavorites).toBeDefined();
      });

    });
    describe("Given an Action control inside appropriate application", function () {
      var model, $element, testAreaApp, m, $e, a, nodeApp;

      beforeEach(function () {
        nodeApp = testAreaEl.clone(true);
        nodeApp.attr("id", testAreaEl.attr("id") + appNumber);

        nodeApp.appendTo($("body"));
        testAreaApp = _sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
        appNumber++;
        model = testAreaApp.ActionControlTest;
        $element = nodeApp.find(".sc-actioncontrol");
        m = model;
        $e = $element;
        a = testAreaApp;
      });

      afterEach(function () {
        //nodeApp.hide();
      });


      it("it should have the 'actions' array with actions defined", function () {
        expect(m.get("actions").length).toBeDefined();
        expect(m.get("actions").length).toBeGreaterThan(0);
      });
      
      it("it should have the first action to be favorite for this particular html layout", function () {
        expect(m.get("actions")[0].isFavorite()).toBe(true);
      });

      it("it should have the first action to be default action for this particular html layout", function () {
        expect(m.get("actions")[0].isDefaultAction()).toBe(true);
      });
      
      it("it should have the 'favorites' array with actions defined", function () {
        expect(m.get("favorites").length).toBeDefined();
        expect(m.get("favorites").length).toBeGreaterThan(0);
      });
      
//      it("it should have the 'text' property to be equal 'Actions'", function () {
//        expect(m.get("text")).toBe("Actions");
//      });
      
      describe("Given an Action model from the ActionControl", function () {
        var action;
        
        beforeEach(function () {
          action = m.get("actions")[0];
        });
        
        it("it should have the id property to be defined", function () {
          expect(action.id).toBeDefined();
        });
        it("it should have the id property to be equal 0D8D20648ED8408283316A10D980A9B6", function () {
          expect(action.id()).toBe('0D8D20648ED8408283316A10D980A9B6');
        });

        it("it should have the text property to be defined", function () {
          expect(action.text).toBeDefined();
        });
        it("it should have the text property to be defined", function () {
          expect(action.text()).toContain('Copy');
        });
        it("it should have the tooltip property to be defined", function () {
          expect(action.tooltip).toBeDefined();
        });
        it("it should have the isIcon property to be defined", function () {
          expect(action.isIcon).toBeDefined();
        });
        it("it should have the isIcon property to be false", function () {
          expect(action.isIcon()).toBe(false);
        });
        it("it should have the iconSrc property to be defined", function () {
          expect(action.iconSrc).toBeDefined();
        });
        it("it should have the iconSrc property to be equal undefined after initialisation with this template", function () {
          expect(action.iconSrc()).toBeUndefined();
        });
        it("it should have the iconBackgroundPosition property to be defined", function () {
           expect(action.iconBackgroundPosition).toBeDefined();
        });
        it("it should have the iconBackgroundPosition property to be equal undefined after initialisation with this template", function () {
          expect(action.iconBackgroundPosition()).toBeUndefined();
        });
        it("it should have the isFavorite property to be defined", function () {
          expect(action.isFavorite).toBeDefined();
        });
        
        it("it should have the click property to be defined", function () {
          expect(action.click).toBeDefined();
        });
        
      });
    });
  };
  
  runTests(jasmineEnv, setupTests, "ActionControl.html");

});