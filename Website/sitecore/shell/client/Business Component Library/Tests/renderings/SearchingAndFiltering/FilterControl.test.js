require(["jasmineEnv", "/-/speak/v1/business/filtercontrol.js"], function (jasmineEnv) {

  var setupTests = function () {
    var descriptor = {
      attributes: [
        { name: "facets", defaultValue: [], which: "which holds the facets" },
        { name: "selectedFacets", defaultValue: [], which: "which holds the currently selected facets" }
      ]
    };

    runComponentTests("FilterControl", descriptor, "Control1");
  };
  
  runTests(jasmineEnv, setupTests);
});