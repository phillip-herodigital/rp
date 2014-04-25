/// <reference path="../../vendors/jasmine-standalone-1.0.0/jasmine.js" />
/// <reference path="../../jasmine.ui.runner.test.js" />
/// <reference path="../../../Sitecore/Repository/Layouts/Renderings/Common/Buttons/Button.js" />
require(["jasmineEnv", "sitecore", "/-/speak/v1/business/treeview.js"], function (jasmineEnv, Sitecore) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a TreeView model", function () {
      var treeView = new Sitecore.Definitions.Models.TreeView();

      describe("when I create a TreeView model", function () {
        it("it should have a 'isVisible' property that determines if the button is visible or not", function () {
          expect(treeView.get("isVisible")).toBeDefined();
        });

        it("it should have a 'selectedItemId' property that contains the id of the currently selected item", function () {
          expect(treeView.get("selectedItemId")).toBeDefined();
        });

        it("it should have a 'checkedItemIds' property that contains the ids of the currently checked items (showCheckBoxes = true)", function () {
          expect(treeView.get("checkedItemIds")).toBeDefined();
        });

        it("it should have a 'isCheckboxEnabled' property", function () {
          expect(treeView.get("isCheckboxEnabled")).toBeDefined();
        });

        it("it should have a 'isKeyboardSupported' property", function () {
          expect(treeView.get("isKeyboardSupported")).toBeDefined();
        });

        it("it should have a 'isPersist' property", function () {
          expect(treeView.get("isPersist")).toBeDefined();
        });

        it("it should have a 'isAutoFocus' property", function () {
          expect(treeView.get("isAutoFocus")).toBeDefined();
        });

        it("it should have a 'isAutoCollapse' property", function () {
          expect(treeView.get("isAutoCollapse")).toBeDefined();
        });

        it("it should have a 'clickFolderMode' property", function () {
            expect(treeView.get("clickFolderMode")).toBeDefined();
        });

        it("it should have a 'selectMode' property", function () {
            expect(treeView.get("selectMode")).toBeDefined();
        });

        it("it should have a 'isNoLink' property", function () {
          expect(treeView.get("isNoLink")).toBeDefined();
        });

        it("it should set 'isVisible' to 'true' by default", function () {
          expect(treeView.get("isVisible")).toBe(true);
        });

        it("it should set 'selectedItemId' to 'null' by default", function () {
          expect(treeView.get("selectedItemId")).toBe(null);
        });

        it("it should set 'checkedItemIds' to 'null' by default", function () {
          expect(treeView.get("checkedItemIds")).toBe(null);
        });
        it("it should set 'isCheckboxEnabled' to 'true' by default", function () {
          expect(treeView.get("isCheckboxEnabled")).toBe(true);
        });
        it("it should set 'isKeyboardSupported' to 'true' by default", function () {
          expect(treeView.get("isKeyboardSupported")).toBe(true);
        });
        it("it should set 'isPersist' to 'false' by default", function () {
          expect(treeView.get("isPersist")).toBe(false);
        });
        it("it should set 'isAutoFocus' to 'true' by default", function () {
          expect(treeView.get("isAutoFocus")).toBe(true);
        });
        it("it should set 'isAutoCollapse' to 'false' by default", function () {
          expect(treeView.get("isAutoCollapse")).toBe(false);
        });
        it("it should set 'clickFolderMode' to '1' by default", function () {
            expect(treeView.get("clickFolderMode")).toBe(1);
        });
        it("it should set 'selectMode' to '3' by default", function () {
            expect(treeView.get("selectMode")).toBe(3);
        });
        it("it should set 'isNoLink' to 'false' by default", function () {
          expect(treeView.get("isNoLink")).toBe(false);
        });
        
      });

      describe("when I toggle a visible tree view ", function () {
        it("it should set 'isVisible' is false", function () {
          var tv = new Sitecore.Definitions.Models.TreeView();
          tv.toggle();

          expect(tv.get("isVisible")).toBe(false);
        });
      });

      describe("when I toggle an invisible property", function () {
        it("it should set isVisible is true", function () {
          var tv = new Sitecore.Definitions.Models.TreeView();
          tv.set("isVisible", false);
          tv.toggle();

          expect(tv.get("isVisible")).toBe(true);
        });
      });
      
      describe("Given a TreeView Control", function () {
        var model, $element, testAreaApp, m, $e, a, appNumber = 0, nodeApp;
        
        
        
        beforeEach(function () {
          nodeApp = testAreaEl.clone(true);
          nodeApp.attr("id", testAreaEl.attr("id") + appNumber);
          
          nodeApp.appendTo($("body"));
          testAreaApp = _sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
          appNumber++;
          model = testAreaApp.TreeViewTest;
          $element = nodeApp.find(".sc-treeview");
          m = model;
          $e = $element;
          a = testAreaApp;
        });
        
        afterEach(function () {
        //  testAreaApp.destroy();
//          a = null;
//          m = null;
//          $e = null;
          nodeApp.hide();
        });
        
        it("it should create the Control when I execute Run", function () {
          expect(a.TreeViewTest).toBeDefined();
        });

        it("it should have the viewModel to be defined inside the model", function () {
          expect(m.viewModel).toBeDefined();
        });

        it("it should have the disable method to be defined inside viewModel", function () {
          expect(m.viewModel.disable).toBeDefined();
        });
        
        it("it should make div disabled when I execute the disable method", function () {
          expect($e.attr("aria-disabled")).toBeUndefined();
          m.viewModel.disable();
          expect($e.attr("aria-disabled")).toBeTruthy();
        });
        
        it("it should have the enable method to be defined inside viewModel", function () {
          expect(m.viewModel.enable).toBeDefined();
        });
        
        it("it should make div enabled when I execute the enable method", function () {
          expect($e.attr("aria-disabled")).toBeUndefined();
          m.viewModel.disable();
          expect($e.attr("aria-disabled")).toBeTruthy();
          m.viewModel.enable();
          expect($e.attr("aria-disabled")).toBe("false");
        });


      
        it("it should have the getTree method to be defined inside viewModel", function () {
          expect(m.viewModel.getTree).toBeDefined();
        });
        
        it("it should have the getTree method to be defined inside viewModel, which returns the tree object", function () {
          var treeObj = m.viewModel.getTree();
          expect(treeObj).toBeDefined();
          expect(treeObj["$tree"]).toBeDefined();
          expect(treeObj["$widget"]).toBeDefined();
        });


        it("it should have the getRoot method to be defined inside viewModel", function () {
          expect(m.viewModel.getRoot).toBeDefined();
        });

        it("it should have the getRoot method to be defined inside viewModel and it should return appropriate object", function () {
          var root = m.viewModel.getRoot();
          expect(root).toBeDefined();
          expect(root["tree"]).toBeDefined();
          expect(root["data"]).toBeDefined();
          expect(root["childList"]).toBeDefined();
        });
        

        it("it should have the getActiveNode method to be defined inside viewModel", function () {
          expect(m.viewModel.getActiveNode).toBeDefined();
        });
        
        it("it should have the getActiveNode method to be defined inside viewModel which returns null when nothing is selected", function () {
          expect(m.viewModel.getActiveNode()).toBeNull();
        });
        it("it should have the getActiveNode method to be defined inside viewModel which returns selected node", function () {

          expect(m.viewModel.getActiveNode()).toBeNull();
          $e.find("li").eq(0).click();
          expect(m.viewModel.getActiveNode()).toBeDefined();
        });
        
        it("it should have the getSelectedNodes method to be defined inside viewModel", function () {
          expect(m.viewModel.getSelectedNodes).toBeDefined();
        });
        
        it("it should have the getSelectedNodes method to be defined inside viewModel and should return empty array by default", function () {
          expect(m.viewModel.getSelectedNodes().length).toBe(0);
        });
        
        it("it should have the getSelectedNodes method to be defined inside viewModel and should return the array of selected nodes", function () {
          expect(m.viewModel.getSelectedNodes().length).toBe(0);
          m.set("isCheckboxEnabled", true);
          $e.find(".dynatree-checkbox").eq(0).click();
          expect(m.viewModel.getSelectedNodes().length).toBe(1);
        });

        it("it should not appear when I set the isVisible property", function () {
          var value = false;
          expect($e.is(":visible")).toEqual(!value);
          m.set("isVisible", value);
          expect(m.get("isVisible")).toEqual(value);
          expect($e.is(":visible")).toEqual(value);
        });
        
        it("it should have the selectedItemId property changed when a node is selected", function () {
          expect(m.get("selectedItemId")).toBeNull();
          $e.find(".dynatree-node").eq(0).click();
          expect(m.get("selectedItemId").length).toBe(38);
        });
      });
    
    });
  };

  runTests(jasmineEnv, setupTests, "TreeView.html");
});