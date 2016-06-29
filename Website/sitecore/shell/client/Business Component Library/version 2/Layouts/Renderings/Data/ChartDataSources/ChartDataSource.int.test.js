(function(speak, describe, it, beforeEach, afterEach, expect) {
  describe("Given a ChartDataSource component", function() {
    var app = speak.app;
    var component = app.ChartDataSourceOk;

    describe("given a service that has data for the ChartDataSource", function() {
      it("bindable IsBusy property should be false", function() {
        expect(component.IsBusy).toBe(false);
        expect(app.TextIsBusy.Text).toBe(component.IsBusy);
      });

      it("bindable HasData property should be false", function() {
        expect(component.HasData).toBe(false);
        expect(app.TextHasData.Text).toBe(component.HasData);
      });

      it("bindable HasNoData property should be true", function() {
        expect(component.HasNoData).toBe(true);
        expect(app.TextHasNoData.Text).toBe(component.HasNoData);
      });

      describe("when loadData() function is called", function() {
        var wasBusy;

        beforeEach(function(done) {
          wasBusy = false;

          component.once("change:IsBusy", function() {
            wasBusy = component.IsBusy && app.TextIsBusy.Text;
          });

          component.loadData({ onSuccess: done });
        });

        it("bindable IsBusy property should be true", function() {
          expect(wasBusy).toBe(true);
        });

        describe("when data is loaded", function() {
          it("bindable DynamicData property should contain data from service", function() {
            expect(component.DynamicData.custom).toBeDefined();
            expect(app.TextDynamicData.Text).toBe(component.DynamicData);
          });

          it("the Messages property should contain messages from service", function() {
            expect(component.Messages.length).toBe(1);
            expect(component.Messages[0]).toBe("This action provides back input parameters.");
          });

          it("bindable HasData property should be true", function() {
            expect(component.HasData).toBe(true);
            expect(app.TextHasData.Text).toBe(component.HasData);
          });

          it("bindable HasNoData property should be false", function() {
            expect(component.HasNoData).toBe(false);
            expect(app.TextHasNoData.Text).toBe(component.HasNoData);
          });

          it("bindable IsBusy property should be false", function() {
            expect(component.IsBusy).toBe(false);
            expect(app.TextIsBusy.Text).toBe(component.IsBusy);
          });

          it("filters (DateFrom, DateTo, Resolution, ResolutionRange) should be passed to the service", function() {
            expect(component.DynamicData.dateFrom).toBe("06-02-2015");
            expect(component.DynamicData.dateTo).toBe("06-05-2015");
            expect(component.DynamicData.resolution).toBe("Week");
            expect(component.DynamicData.resolutionRange).toBe("8");
          });

          it("extra parameters set in QueryParameters property should be passed to the service", function() {
            expect(component.DynamicData.custom).toBe("something");
          });

          describe("when wrong URL is set to ServiceUrl property", function() {
            beforeEach(function() {
              component.ServiceUrl = "/sitecore/api/ssc/speak-guidance/chart/-/ups";
            });

            afterEach(function() {
              component.ServiceUrl = "/sitecore/api/ssc/speak-guidance/chart/-/mirror";
            });

            describe("when loadData() function is called", function() {
              var error;

              beforeEach(function(done) {
                error = null;

                component.once("error", function(err) {
                  error = err;
                  done();
                });

                component.loadData();
              });

              describe("when server has responded", function() {
                it("the 'error' event should be triggered", function() {
                  expect(error.name).toBe("Error");
                  expect(error.message.indexOf("Server returned:")).toBe(0);
                });

                it("bindable IsBusy property should be false", function() {
                  expect(component.IsBusy).toBe(false);
                  expect(app.TextIsBusy.Text).toBe(component.IsBusy);
                });

                it("bindable HasData property should be false", function() {
                  expect(component.HasData).toBe(false);
                  expect(app.TextHasData.Text).toBe(component.HasData);
                });

                it("bindable HasNoData property should be true", function() {
                  expect(component.HasNoData).toBe(true);
                  expect(app.TextHasNoData.Text).toBe(component.HasNoData);
                });
              });
            });
          });
        });
      });
    });
  });
})(Sitecore.Speak, describe, it, beforeEach, afterEach, expect);