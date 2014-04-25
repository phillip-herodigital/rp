require(["jasmineEnv", "/-/speak/v1/business/panel.js"], function (jasmineEnv) {

  var setupTests = function () {
    var descriptor = {
      attributes: [
      ]
    };

    runComponentTests("Panel", descriptor, "Control1");
  };
  
  runTests(jasmineEnv, setupTests);
});