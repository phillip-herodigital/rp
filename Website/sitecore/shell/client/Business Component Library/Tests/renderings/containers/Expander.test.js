require(["jasmineEnv", "/-/speak/v1/business/expander.js"], function (jasmineEnv) {

  var setupTests = function () {
    var descriptor = {
      attributes: [
        { name: "isOpen", defaultValue: true, which: "which indicates if the expander is expanded or collapsed" }
      ]
    };

    runComponentTests("Expander", descriptor, "Control1");
  };
  
  runTests(jasmineEnv, setupTests,"Expander.htm");
});