describe("Given a ChartDataSource component", function () {
  var sut = Sitecore.Speak.app.ChartDataSource;

  it("should exists", function () {
    expect(sut).toBeDefined();
  });

  describe("Given a ChartDataSource", function () {
    it("it should have a DynamicData property that defines the data received from the server.", function () {
      expect(sut.DynamicData).toBeDefined();
    });

    it("it should have a ServiceUrl property that defines the call to the server", function () {
      expect(sut.ServiceUrl).toBeDefined();
    });

    it("it should have a QueryParameters property that determines the parameters to pass to the server call", function () {
      expect(sut.QueryParameters).toBeDefined();
    });

    it("it should have a IsBusy property that determines whether the provider is still busy waiting for data", function () {
      expect(sut.IsBusy).toBeDefined();
    });

    it("it should have a HasData (false by default) property that determines whether the provider has data after the call to the server is completed", function () {
      expect(sut.HasData).toBeDefined();
      expect(sut.HasData).toBe(false);
    });

    it("it should have a HasNoData (true by default) property that determines whether the provider has NO data after the call to the server is completed", function () {
      expect(sut.HasNoData).toBeDefined();
      expect(sut.HasNoData).toBe(true);
    });

    it("it should have a Messages property that holds the server info about data messages.", function () {
      expect(sut.Messages).toBeDefined();
    });

    it("it should have a DateFrom property that holds the data filter's date from.", function () {
      expect(sut.DateFrom).toBeDefined();
    });

    it("it should have a DateTo property that holds the data filter's date to.", function () {
      expect(sut.DateTo).toBeDefined();
    });

    it("it should have a Resolution property that holds the data filter's resolution.", function () {
      expect(sut.Resolution).toBeDefined();
    });

    it("it should have a ResoluitonRange property that holds the data filter's resolution range.", function () {
      expect(sut.ResolutionRange).toBeDefined();
    });
  });

  describe("Given an ChartDataProvider Control", function() {

    var testData = {

      "messages": [
        {
          "messageType": "WARNING",
          "text": "Lorem ipsum"
        },
        {
          "messageType": "INFO",
          "text": "Sorting is different"
        }
      ],
      "filter": null,
      "data": {        
        "dataset": [
          {
            "data": [
              {
                "recency": "+ 3 dage",
                "date": "30.01.99 23.59",
                "device": "PC, Windows",
                "value": "12",
                "duration": "10",
                "pageviews": "1",
                "channel": "10",
                "itemId": 2
              },
              {
                "recency": "+ 1 måned 23 dage",
                "date": "01.12.13 00.01",
                "device": "Mobil, iOS",
                "value": "1",
                "duration": "100",
                "pageviews": "5",
                "channel": "15",
                "itemId": 1
              }
            ]
          }
        ]
      }
    };
  
    it("it should return the data after the ajax request has been executed", function () {
      
      sut.on("change:DynamicData", function () {
        var responseData = sut.DynamicData;
        expect(responseData).toBe(testData);
      });

      sut.on("change:Messages", function () {        
        var responseMessages = sut.Messages;
        expect(responseMessages).toBe(testData.messages);
      });

      sut.on("change:ServerSorting", function () {
        var responseSorting = sut.ServerSorting;
        expect(responseSorting).toBe(testData.sorting);
      });

      sut.DynamicData = testData;
      expect(true).toBe(true);
    });

    describe("it should have a handleError property", function () {
      it("to be defined as a function", function () {
        expect(sut.handleError).toBeDefined();
        expect(typeof sut.handleError).toBe("function");
      });

      describe("and when it is called", function () {
        var errorObject = {
          name: "error",
          message: "lorem ipsum",
          response: "404"
        },
          hasNoData = sut.HasNoData,
          hasData = sut.HasData,
          callback = jasmine.createSpy(),
          callbackErrorObject;

        sut.on("error", function (errorObj) {
          callbackErrorObject = errorObj;
          callback();
        });

        sut.handleError(errorObject);

        it("HasNoData is changed from false to true", function () {
          expect(hasNoData).toBe(true);
          expect(sut.HasNoData);
        });

        it("and HasData stays false", function () {
          expect(hasData).toBe(false);
          expect(sut.HasData);
        });

        it("and the error event is triggered", function () {
          expect(callback).toHaveBeenCalled();
        });

        it("and errorObject is sent as a parameter to the error event", function () {
          expect(callbackErrorObject === errorObject).toBe(true);
        });
      });
    });

  });


});