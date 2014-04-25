require(["jasmineEnv", "sitecore", "/-/speak/v1/controls/searchdatasource.js"], function (jasmineEnv, sc) {
  var setupTests = function (testAreaEl) {
    "use strict";

    describe("Given a SearchDataSource model", function () {
      var sdsModel = new sc.Definitions.Models.SearchDataSource();
      describe("when I create a model", function () {
        it("it should have a 'text' property initialized by default value", function () {
          expect(sdsModel.get("text")).toBe("");
        });
        
        it("it should have a 'searchConfig' property initialized by default value", function () {
          expect(sdsModel.get("searchConfig")).toBe(null);
        });

        it("it should have a 'rootItemId' property initialized by default value", function () {
          expect(sdsModel.get("rootItemId")).toBe(null);
        });

        it("it should have a 'pageSize' property initialized by default value", function () {
          expect(sdsModel.get("pageSize")).toBe(0);
        });

        it("it should have a 'pageIndex' property initialized by default value", function () {
          expect(sdsModel.get("pageIndex")).toBe(0);
        });

        it("it should have a 'totalItemsCount' property initialized by default value", function () {
          expect(sdsModel.get("totalItemsCount")).toBe(0);
        });

        it("it should have a 'items' property initialized by default value", function () {
          expect(sdsModel.get("items")).toBe(null);
        });

        it("it should have a 'selectedFacets' property initialized by default value", function () {
          expect(sdsModel.get("selectedFacets").length).toBe(0);
        });

        it("it should have a 'facets' property initialized by default value", function () {
          expect(sdsModel.get("facets").length).toBe(0);
        });

        it("it should have a 'facetsRootItemId' property initialized by default value", function () {
          expect(sdsModel.get("facetsRootItemId")).toBe(null);
        });

        it("it should have a 'formatting' property initialized by default value", function () {
          expect(sdsModel.get("formatting")).toBe("");
        });

        it("it should have a 'sorting' property initialized by default value", function () {
          expect(sdsModel.get("sorting")).toBe("");
        });

        it("it should have a 'language' property", function () {
          expect(sdsModel.get("language")).toBeDefined();
        });

        it("it should have a 'database' property", function () {
          expect(sdsModel.get("database")).toBeDefined();
        });

        it("it should have a 'pagingMode' property initialized by default value", function () {
          expect(sdsModel.get("pagingMode")).toBe("appending");
        });

        it("it should have a 'isBusy' property initialized by default value", function () {
          expect(sdsModel.get("isBusy")).toBe(false);
        });

        it("it should have a 'hasItems' property initialized by default value", function () {
          expect(sdsModel.get("hasItems")).toBe(false);
        });

        it("it should have a 'hasNoItems' property initialized by default value", function () {
          expect(sdsModel.get("hasNoItems")).toBe(true);
        });

        it("it should have a 'hasMoreItems' property initialized by default value", function () {
          expect(sdsModel.get("hasMoreItems")).toBe(false);
        });

        it("it should have a 'isReady' property initialized by default value", function () {
          expect(sdsModel.isReady).toBe(false);
        });

        it("it should have a 'pendingRequests' property initialized by default value", function () {
          expect(sdsModel.pendingRequests).toBe(0);
        });

        it("it should have a 'lastPage' property initialized by default value", function () {
          expect(sdsModel.lastPage).toBe(0);
        });
      });

      describe("when I refresh datasource", function () {
          beforeEach(function () {
              sdsModel.set("pageSize", 10);
              spyOn(sdsModel, 'getItems');
              sdsModel.refresh();
          });
          it("it should set 'pageIndex' to 0", function () {
              expect(sdsModel.get("pageIndex")).toBe(0);              
          });
          it("it should set 'lastPage' to 0", function () {
              expect(sdsModel.lastPage).toBe(0);
          });
          it("it should execute getItems", function () {
              expect(sdsModel.getItems).toHaveBeenCalled();
          });
      });

      describe("when I call next", function () {
          var page = 0;
          beforeEach(function () {
              sdsModel.set("pageSize", 10);
              page = sdsModel.lastPage;
              spyOn(sdsModel, 'getItems');
              sdsModel.next();
          });
          it("it should set 'lastPage' to +1", function () {
              expect(sdsModel.lastPage).toBe(page + 1);
          });
          it("it should execute getItems", function () {
              expect(sdsModel.getItems).toHaveBeenCalled();
          });
      });

      describe("when I call getItems", function () {
          var stub, pendingRequests, originalDb;
          beforeEach(function () {
              var db = (function () {
                  var obj = { search: function () { } };
                  stub = obj;
                  spyOn(stub, 'search');
                  return obj;
              });

              originalDb = sc.Definitions.Data.Database;
              sc.Definitions.Data.Database = db;

              sdsModel.set("database", "core");
              sdsModel.set("text", "111");
              spyOn(sdsModel, 'getFacets');
              spyOn(sdsModel, 'getOptions');
              sdsModel.isReady = true;
              pendingRequests = sdsModel.pendingRequests;
              sdsModel.getItems();
          });
        
          afterEach(function () {
            sc.Definitions.Data.Database = originalDb;
          });

          it("it should set 'isBusy' to true", function () {
              expect(sdsModel.get("isBusy")).toBe(true);
          });
          it("it should set 'pendingRequests' to +1", function () {
              expect(sdsModel.pendingRequests).toBe(pendingRequests + 1);
          });
          it("it should execute database.search", function () {
              expect(stub.search).toHaveBeenCalled();
          });
          it("it should execute getOptions", function () {
              expect(sdsModel.getOptions).toHaveBeenCalled();
          });
      });

    });

    
    describe("Given a Search Datasource", function () {
      var model, $element, testAreaApp, m, $e, a, appNumber = 0, nodeApp;

      beforeEach(function () {
        nodeApp = testAreaEl.clone(true);
        nodeApp.attr("id", testAreaEl.attr("id") + appNumber);

        nodeApp.appendTo($("body"));
        testAreaApp = _sc.Factories.createApp(testAreaEl.attr("id") + appNumber);
        appNumber++;
        model = testAreaApp.TestSearchDataSource;
        $element = nodeApp.find("script[type='text/x-sitecore-searchdatasource']");
        m = model;
        $e = $element;
        a = testAreaApp;
      });

      afterEach(function () {
        nodeApp.hide();
      });

      it("it should create the SearchDataSource when I execute Run", function () {
        expect(a.TestSearchDataSource).toBeDefined();
      });

    });
  };
  runTests(jasmineEnv, setupTests, "SearchDataSource.html");
});