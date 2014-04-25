require(["jasmineEnv", "/-/speak/v1/business/tabcontrol.js"], function (jasmineEnv) {

  var setupTests = function () {
    var descriptor = {
      attributes: [
        { name: "staticTabs", defaultValue: [], which: "which holds the unremovable tabs" },
        { name: "dynamicTabs", defaultValue: [], which: "which holds the removable tabs" },
        { name: "selectedTab", defaultValue: "", which: "which holds the currently selected tab" },
        { name: "tabs", defaultValue: "", which: "which holds the tabs" },
        { name: "selectedTabIndex", defaultValue: "", which: "which holds the index of the selected tab" }
      ]
    };

    runComponentTests("TabControl", descriptor, "Control1");
  };
  
  runTests(jasmineEnv, setupTests);
});