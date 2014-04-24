require(["jasmineEnv", "/-/speak/v1/business/combobox.js"], function (jasmineEnv) {

  var setupTests = function () {
    var descriptor = {
      attributes: [
        { name: "items", defaultValue: [], which: "which holds items in the list box" },
        { name: "selectedItem", defaultValue: null, which: "which holds the currently selected item" },
        { name: "selectedItemId", defaultValue: null, which: "which holds the id of the currently selected item" }
      ]
    };

    runComponentTests("ComboBox", descriptor, "Control1");
  };
  
  runTests(jasmineEnv, setupTests);
});