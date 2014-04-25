require(["jasmineEnv", "sitecore", "/-/speak/v1/business/Repeater.js"], function (jasmineEnv, sc) {
  
  var setupTests = function (testAreaEl) {
    "use strict";
    
    describe("Given a Repeater model", function () {
      var repeater = new Sitecore.Definitions.Models.Repeater();

      describe("when I create a Repeater model", function () {
        it("it should have a isLoading property", function () {
          expect(repeater.get("isLoading")).toBeDefined();
        });
        
        it("it should set isLoading to false by default", function () {
          expect(repeater.get("isLoading")).toBe(false);
        });

      });
    });

    describe("Given an Repeater Control", function () {
      var model, $element, testAreaApp, m, $e, a, appNumber = 0, nodeApp;

      beforeEach(function () {
        nodeApp = testAreaEl.clone(true);
        nodeApp.attr("id", testAreaEl.attr("id") + appNumber);

        nodeApp.appendTo($("body"));
        testAreaApp = sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
        appNumber++;
        model = testAreaApp.TestRepeater;
        $element = nodeApp.find(".sc-repeater");
        m = model;
        $e = $element;
        a = testAreaApp;
      });

      afterEach(function () {
        nodeApp.hide();
      });

      it("it should create the Repeater when I execute Run", function () {
        expect(a.TestRepeater).toBeDefined();
      });

      it("it should have the RenderedItems to be defined inside the model", function () {
        expect(m.RenderedItems).toBeDefined();
      });

      it("it should set isLoading to true after setting items", function () {
        var items = [{ itemId: "{83BC4341-31E1-4639-99F4-E17E3E5E4CE4}", $database: "core" }, { itemId: "{4739D9D6-55A3-426F-A6D6-47C62C289566}", $database: "core" }];
        m.set("items", items);
        expect(m.get("isLoading")).toBe(true);
      });

      it("it should have 2 RenderedItems after loading 2 items", function () {
        var items = [{ itemId: "{83BC4341-31E1-4639-99F4-E17E3E5E4CE4}", $database: "core" }, { itemId: "{4739D9D6-55A3-426F-A6D6-47C62C289566}", $database: "core" }];
        m.set("items", items);

        waitsFor(function() {
          return m.get("isLoading") == false;
        }, "Items should be received", 2000);

        runs(function() {
          expect(m.get("items").length).toBe(2);
          expect(m.RenderedItems.length).toBe(2);          
        });
      });

      it("it should have corresponding sub apps after loading 2 items", function () {
        var items = [{ itemId: "{83BC4341-31E1-4639-99F4-E17E3E5E4CE4}", $database: "core" }, { itemId: "{4739D9D6-55A3-426F-A6D6-47C62C289566}", $database: "core" }];
        m.set("items", items);

        waitsFor(function() {
          return m.get("isLoading") == false;
        }, "Items should be received", 2000);

        runs(function() {
          expect(sc[m.RenderedItems.models[0].get("app").name]).toBeDefined();
          expect(sc[m.RenderedItems.models[1].get("app").name]).toBeDefined();
        });
      });

      it("it should have 3 RenderedItems after adding 1 more item to existing 2 items", function () {
        var items = [{ itemId: "{83BC4341-31E1-4639-99F4-E17E3E5E4CE4}", $database: "core" }, { itemId: "{4739D9D6-55A3-426F-A6D6-47C62C289566}", $database: "core" }];
        m.set("items", items);

        
        waitsFor(function () {
          return m.get("isLoading") == false;
        }, "Items should be received", 2000);

        runs(function () {          
          var addItem = { itemId: "{83BC4341-31E1-4639-99F4-E17E3E5E4CE4}", $database: "core" };
          model.viewModel.add(addItem);
        });

        waitsFor(function () {
          return m.get("isLoading") == false;
        }, "Items should be received", 2000);

        runs(function () {
          expect(m.get("items").length).toBe(3);
          expect(m.RenderedItems.length).toBe(3);
        });
      });

      it("it should have 1 RenderedItems after removing 1 item of existing 2 items", function () {
        var items = [{ itemId: "{83BC4341-31E1-4639-99F4-E17E3E5E4CE4}", $database: "core" }, { itemId: "{4739D9D6-55A3-426F-A6D6-47C62C289566}", $database: "core" }];
        m.set("items", items);
        
        waitsFor(function () {
          return m.get("isLoading") == false;
        }, "Items should be received", 2000);

        runs(function () {          
          model.viewModel.remove(model.RenderedItems.models[0].get("app"));
        });

        waitsFor(function () {
          return m.get("isLoading") == false;
        }, "Items should be received", 2000);

        runs(function () {
          expect(m.get("items").length).toBe(1);
          expect(m.RenderedItems.length).toBe(1);
        });
      });

      it("it should have 0 RenderedItems after reset", function () {
        var items = [{ itemId: "{83BC4341-31E1-4639-99F4-E17E3E5E4CE4}", $database: "core" }, { itemId: "{4739D9D6-55A3-426F-A6D6-47C62C289566}", $database: "core" }];
        m.set("items", items);
        
        waitsFor(function () {
          return m.get("isLoading") == false;
        }, "Items should be received", 2000);

        runs(function () {
          model.viewModel.reset();
          expect(m.RenderedItems.length).toBe(0);
        });
      });

    });
  };

  runTests(jasmineEnv, setupTests, "Repeater.htm");
});