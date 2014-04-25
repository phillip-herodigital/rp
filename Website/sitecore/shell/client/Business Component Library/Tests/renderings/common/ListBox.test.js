require(["jasmineEnv", "/-/speak/v1/business/listbox.js"], function (jasmineEnv) {

  var setupTests = function () {
    var descriptor = {
      attributes: [
        { name: "items", defaultValue: [], which: "which holds items in the list box" },
        { name: "selectedItem", defaultValue: null, which: "which holds the currently selected item" },
        { name: "selectedItems", defaultValue: [], which: "which holds the currently selected items" },
        { name: "selectedItemId", defaultValue: null, which: "which holds the id of the currently selected item" },
        { name: "selectedItemIds", defaultValue: [], which: "which holds the ids of the currently selected items" }
      ]
    };

    runComponentTests("ListBox", descriptor, "Control1");
  };
  
  runTests(jasmineEnv, setupTests);
});