define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "GlobalLogo",
    selector: ".sc-globalLogo",
    attributes: [
      { name: "src", value: "$el.attr:src" }
    ]
  });
});