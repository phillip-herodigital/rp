require(["jasmineEnv", "/-/speak/v1/controls/webservicedatasource.js"], function (jasmineEnv) {

  var setupTests = function () {
    var descriptor = {
      base: "ComponentModel",
      attributes: [
        { name: "url", defaultValue: "", which: "which points to the web service .asmx file" },
        { name: "methodName", defaultValue: "", which: "which contains the name of the method to call" },
        { name: "nameSpace", defaultValue: "", which: "which specifies the namespace of the web service" },
        { name: "parameters", defaultValue: { }, which: "which holds the parameter to pass to the web service" },
        { name: "requestType", defaultValue: "", which: "which specifies the request type: 'soap1.1' (SOAP 1.1) - default, 'soap1.2', 'httpget' or 'httppost'" },
        { name: "response", defaultValue: "", which: "which contains the raw response from the web service" },
        { name: "isBusy", defaultValue: false, which: "which determines if one or more requests are being made" },
        { name: "hasResponse", defaultValue: false, which: "which determines if a response is available" }
      ],
      
      describe: function () {
        var webService = new Sitecore.Definitions.Models.WebServiceDataSource();
        webService.set("url", "/sitecore/shell/webservice/service.asmx");
        webService.set("methodName", "GetDatabases");
        webService.set("nameSpace", "http://sitecore.net/visual/");
        
        it("it should be able to call a web service", function () {
          $.mockjaxClear();
          $.mockjax({
            url: "/sitecore/shell/webservice/service.asmx",
            responseText: {
              statusCode: 200,
              result: "OK"
            }
          });

          var callback = jasmine.createSpy();

          webService.on("change:response", function() {
            callback();
            var response = webService.get("response");
            expect(response).toBeDefined();
            //TODO: fix this stuff
            if (response) {
              expect(response.statusCode).toEqual(200);
              expect(response.result).toEqual("OK");
            }
            
          });

          webService.refresh();
          waitsFor(function () {
            return callback.callCount > 0;
          });

          runs(function () {
            expect(callback).toHaveBeenCalled();
          });

          $.mockjaxClear();
        });

      }
    };

    runComponentTests("WebServiceDataSource", descriptor, "Control1");
  };
  
  runTests(jasmineEnv, setupTests);
});