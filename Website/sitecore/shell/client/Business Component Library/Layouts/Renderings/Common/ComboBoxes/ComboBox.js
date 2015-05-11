
require.config({
  paths: {
    selectControlBaseComponent: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Common/ComboBoxes/SelectControlBase",
  }
});

define(["sitecore", "selectControlBaseComponent"], function (_sc, selectControlBase) {
  
  _sc.Factories.createBaseComponent({
    name: "ComboBox",
    base: "SelectControlBase",
    selector: ".sc-combobox",
    
    attributes: selectControlBase.model.prototype._scAttrs,


    initialize: function () {
      this._super();
    }
  });
});