
require.config({
  paths: {
    multiSelectControlBaseComponent: "/sitecore/shell/client/Business Component Library/Layouts/Renderings/Common/ComboBoxes/MultiSelectControlBase",
  }
});

define(["sitecore", "multiSelectControlBaseComponent"], function (_sc, multiSelectControlBaseComponent) {
  _sc.Factories.createBaseComponent({
    name: "ListBox",
    base: "MultiSelectControlBase",
    selector: ".sc-listbox",
    attributes: multiSelectControlBaseComponent.model.prototype._scAttrs,

    initialize: function (options) {
      this._super();
    }
  });
});