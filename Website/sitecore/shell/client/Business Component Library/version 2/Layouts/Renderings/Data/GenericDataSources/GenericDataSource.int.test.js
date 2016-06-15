(function(speak, describe, it, beforeEach, afterEach, expect) {
  describe("Given a GenericDataSource component", function() {
    var app = speak.app;
    var component1 = app.GenericDataSource,
        component2 = app.GenericDataSourceMirror;
    var parameters = {
      "serverSorting": [{
          "field": "recency",
          "direction": "asc"
      }, {
        "field": "name",
        "direction": "asc"
      }],
      "pageSize": 100,
      "pageIndex": 2
    };
    var custom = {
      "addData": {
        "field": "recency",
        "direction": "asc",
        "custom": {
          "field": "recency",
          "direction": "asc"
        }
      }
    };

    describe("given a service that has data for the GenericDataSource", function() {
      it("bindable IsBusy property should be false", function() {
        expect(component1.IsBusy).toBe(false);
        expect(app.CheckBox1.IsChecked).toBe(component1.IsBusy);
      });

      it("bindable HasData property should be false", function() {
        expect(component1.HasData).toBe(false);
        expect(app.CheckBox2.IsChecked).toBe(component1.HasData);
      });

      it("bindable HasNoData property should be true", function() {
        expect(component1.HasNoData).toBe(true);
        expect(app.CheckBox3.IsChecked).toBe(component1.HasNoData);
      });

      describe("when data is loaded with parameters", function () {
        
        beforeEach(function (done) {
          component2.loadData({ onSuccess: done, parameters: parameters });
        });

        it("additional parameters (serverSorting, pageSize, pageIndex) should be passed to the service", function () {
          expect(JSON.stringify(component2.DynamicData.serverSorting)).toBe(JSON.stringify(parameters.serverSorting));
          expect(component2.DynamicData.pageSize).toBe(parameters.pageSize);
          expect(component2.DynamicData.pageIndex).toBe(parameters.pageIndex);
        });

        it("query parameters (custom) should be passed to the service", function () {
          expect(component2.DynamicData.custom).toBe("something");
        });        
      });

      describe("when data is loaded with ServerSorting defined", function () {
        var serverSorting = [{
            "field": "recency",
            "direction": "asc"
          }];
        beforeEach(function (done) {
          component2.ServerSorting = serverSorting;
          component2.loadData({ onSuccess: done, parameters: custom });
        });

        it("serverSorting should be passed to the service", function () {
          expect(JSON.stringify(component2.DynamicData.serverSorting)).toBe(JSON.stringify(serverSorting));
        });
      });

      describe("when loadData() function is called", function() {
        var wasBusy;

        beforeEach(function(done) {
          wasBusy = false;

          component1.once("change:IsBusy", function() {
            wasBusy = component1.IsBusy && app.CheckBox1.IsChecked;
          });

          component1.loadData({ onSuccess: done });
        });

        it("bindable IsBusy property should be true", function() {
          expect(wasBusy).toBe(true);
        });

        describe("when data is loaded", function() {
          it("bindable DynamicData property should contain data from service", function() {
            expect(component1.DynamicData.dataset).toBeDefined();
          });

          it("the Messages property should contain messages from service", function() {
            expect(component1.Messages.length).toBe(2);
            expect(component1.Messages[0].text).toBe("Lorem ipsum");
          });

          it("bindable HasData property should be true", function() {
            expect(component1.HasData).toBe(true);
            expect(app.CheckBox2.IsChecked).toBe(component1.HasData);
          });

          it("bindable HasNoData property should be false", function() {
            expect(component1.HasNoData).toBe(false);
            expect(app.CheckBox3.IsChecked).toBe(component1.HasNoData);
          });

          it("bindable IsBusy property should be false", function() {
            expect(component1.IsBusy).toBe(false);
            expect(app.CheckBox1.IsChecked).toBe(component1.IsBusy);
          });

          it("ServerSorting should contain sorting from service", function () {
            expect(component1.ServerSorting.length).toBe(2);
            expect(component1.ServerSorting[0].field).toBe("recency");
          });

          it("ListSorting should contain sorting from service", function () {
            expect(component1.ListSorting).toBe("arecency|ddate");
          });

          describe("when wrong URL is set to ServiceUrl property", function () {
            var oldUrl;
            beforeEach(function () {
              oldUrl = component1.ServiceUrl;
              component1.ServiceUrl = "/sitecore/api/ssc/speak-guidance/chart/-/ups";
            });

            afterEach(function() {
              component1.ServiceUrl = oldUrl;
            });

            describe("when loadData() function is called", function() {
              var error;

              beforeEach(function(done) {
                error = null;

                component1.once("error", function(err) {
                  error = err;
                  done();
                });

                component1.loadData();
              });

              describe("when server has responded", function() {
                it("the 'error' event should be triggered", function() {
                  expect(error.name).toBe("Error");
                  expect(error.message.indexOf("Server returned:")).toBe(0);
                });

                it("bindable IsBusy property should be false", function() {
                  expect(component1.IsBusy).toBe(false);
                  expect(app.CheckBox1.IsChecked).toBe(component1.IsBusy);
                });

                it("bindable HasData property should be false", function() {
                  expect(component1.HasData).toBe(false);
                  expect(app.CheckBox2.IsChecked).toBe(component1.HasData);
                });

                it("bindable HasNoData property should be true", function() {
                  expect(component1.HasNoData).toBe(true);
                  expect(app.CheckBox3.IsChecked).toBe(component1.HasNoData);
                });
              });
            });
          });
        });
      });
    });
  });
})(Sitecore.Speak, describe, it, beforeEach, afterEach, expect);