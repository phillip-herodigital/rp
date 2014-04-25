require(["jasmineEnv", "sitecore", "/-/speak/v1/controls/querydatasource.js"], function (jasmineEnv, sc) {
  var setupTests = function (testAreaEl) {
    "use strict";
    var appNumber = 0;

    describe("Given a QueryDataSource model", function () {
      var queryDataSource = new Sitecore.Definitions.Models.QueryDataSource();

      describe("when I create a model", function () {
        it("it should have a 'query' property", function () {
          expect(queryDataSource.get("query")).toBeDefined();
        });
        
        it("it should have a 'language' property", function () {
          expect(queryDataSource.get("language")).toBeDefined();
        });
        
        it("it should have a 'database' property", function () {
          expect(queryDataSource.get("database")).toBeDefined();
        });
        
        it("it should have a 'pageSize' property", function () {
          expect(queryDataSource.get("pageSize")).toBeDefined();
        });
        
        it("it should have a 'pageIndex' property", function () {
          expect(queryDataSource.get("pageIndex")).toBeDefined();
        });
        
        it("it should have a 'pageCount' property", function () {
          expect(queryDataSource.get("pageCount")).toBeDefined();
        });
        
        it("it should have a 'totalItemsCount' property", function () {
          expect(queryDataSource.get("totalItemsCount")).toBeDefined();
        });
        
        it("it should have a 'items' property", function () {
          expect(queryDataSource.get("items")).toBeDefined();
        });
        
        it("it should have a 'fields' property", function () {
          expect(queryDataSource.get("fields")).toBeDefined();
        });
        
        it("it should have a 'isBusy' property", function () {
          expect(queryDataSource.get("isBusy")).toBeDefined();
        });

        it("it should set 'query' to empty string by default", function () {
          expect(queryDataSource.get("query")).toBe("");
        });
        
        it("it should set 'language' to empty string by default", function () {
          expect(queryDataSource.get("language")).toBe("");
        });
        
        it("it should set 'database' to empty string by default", function () {
          expect(queryDataSource.get("database")).toBe("");
        });
        
        it("it should set 'pageSize' to 0 by default", function () {
          expect(queryDataSource.get("pageSize")).toBe(0);
        });
        
        it("it should set 'pageIndex' to 0 by default", function () {
          expect(queryDataSource.get("pageIndex")).toBe(0);
        });
        
        it("it should set 'pageCount' to 1 by default", function () {
          expect(queryDataSource.get("pageCount")).toBe(1);
        });
        
        it("it should set 'totalItemsCount' to 0 by default", function () {
          expect(queryDataSource.get("totalItemsCount")).toBe(0);
        });
        
        it("it should set 'items' to empty by default", function () {
          expect(queryDataSource.get("items").toString()).toBe("");
        });
        
        it("it should set 'fields' to null by default", function () {
          expect(queryDataSource.get("fields")).toBe(null);
        });
        
        it("it should set 'isBusy' to false by default", function () {
          expect(queryDataSource.get("isBusy")).toBe(false);
        });
      });
      
      describe("when I refresh datasource", function () {
        var stub, pendingRequests, nodeApp, testAreaApp, model, originalDatabase;

        beforeEach(function () {
          nodeApp = testAreaEl.clone(true);
          nodeApp.attr("id", testAreaEl.attr("id") + appNumber);

          nodeApp.appendTo($("body"));
          testAreaApp = _sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
          appNumber++;
          model = testAreaApp.TestQueryDataSource;
          
          var db = (function () {
            var obj = { query: function () { } };
            stub = obj;
            spyOn(stub, 'query');
            return obj;
          });

          originalDatabase = sc.Definitions.Data.Database;
          sc.Definitions.Data.Database = db;
          
          model.set("database", "core");
          model.set("query", "111");
          model.isReady = true;
          pendingRequests = queryDataSource.pendingRequests;
          queryDataSource.refresh();
        });
        
        afterEach(function () {
          nodeApp.hide();
          sc.Definitions.Data.Database = originalDatabase;
        });
        
        it("it should set 'isBusy' to true", function () {
          expect(model.get("isBusy")).toBe(true);
        });

        it("it should have 'query' value, which shouldn't be null", function () {
          expect(model.get("query")).not.toBe(null);
        });
        
        it("it should set 'isBusy' to true", function () {
          expect(model.get("isBusy")).toBe(true);
        });
        
        it("it should set 'pendingRequests' to +1", function () {
          expect(model.pendingRequests).toBe(pendingRequests + 1);
        });

        it("it should execute database.search", function () {
          expect(stub.query).toHaveBeenCalled();
        });

      });

      describe("when I call 'completed' method", function () {
        var pendingRequests, items, totalCount = 2, nodeApp, testAreaApp, model, m, $e, a, $element;
        beforeEach(function () {
          nodeApp = testAreaEl.clone(true);
          nodeApp.attr("id", testAreaEl.attr("id") + appNumber);

          nodeApp.appendTo($("body"));
          testAreaApp = _sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
          appNumber++;
          model = testAreaApp.TestQueryDataSource;
          $element = nodeApp.find("script[type='text/x-sitecore-querydatasource']");
          $e = $element;
          a = testAreaApp;
          
          pendingRequests = model.pendingRequests;
          queryDataSource.set("pageSize", 10);
          items = [
            {
              $displayName: "Item Buckets",
              $templateName: "Template Folder",
              __Created: "Thursday, October 27, 2011 2:37 PM",
              itemId: "{AB323CEF-9997-47D7-A070-CDC1177D82B0}",
              itemName: "Item Buckets"
            },
            {
              $displayName: "Item Buckets",
              $templateName: "Template Folder",
              __Created: "Wednesday, October 26, 2011 2:37 PM",
              itemId: "{AB323CEF-9997-47D7-A070-CDC1177D82BD}",
              itemName: "Item Buckets"
            }
          ];
          model.completed(items, totalCount);
        });
        
        afterEach(function () {
          nodeApp.hide();
        });
        
        it("it should set 'pendingRequests' to -1", function () {
          expect(model.pendingRequests).toBe(pendingRequests != 0 ? (pendingRequests - 1) : 0);
        });
        
        it("it should set 'isBusy' to false, when we have pendingRequests <= 0", function () {
          model.pendingRequests = -1;
          expect(model.get("isBusy")).toBe(false);
        });
        
        it("it should set 'pendingRequests' to 0, when we have pendingRequests <= 0", function () {
          model.pendingRequests = -1;
          model.completed(items, totalCount);
          expect(model.pendingRequests).toBe(0);
        });
      });

    });
    
    
    describe("Given a Query Datasource", function () {
      var testAreaApp, nodeApp;

      beforeEach(function () {
        nodeApp = testAreaEl.clone(true);
        nodeApp.attr("id", testAreaEl.attr("id") + appNumber);

        nodeApp.appendTo($("body"));
        testAreaApp = _sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
        appNumber++;
      });

      afterEach(function () {
        nodeApp.hide();
      });

      it("it should create the QueryDataSource when I execute Run", function () {
        expect(testAreaApp.TestQueryDataSource).toBeDefined();
      });

    });
    
  };
  runTests(jasmineEnv, setupTests, "QueryDataSource.html");
 
});