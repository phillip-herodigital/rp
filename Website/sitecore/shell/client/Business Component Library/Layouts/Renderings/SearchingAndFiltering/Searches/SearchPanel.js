define(["sitecore"], function (_sc) {
  Sitecore.Factories.createBaseComponent({
    name: "SearchPanel",
    base: "ControlBase",
    selector: ".sc-search"
  });
});
