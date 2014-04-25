define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    base: "InputBase",
    name: "TextBox",
    selector: ".sc-textbox",
    attributes: [
      { name: "text", value: "$el.val" },
      { name: "isReadOnly", defaultValue: false, value: "$el.prop:readonly" },
      { name: "isRequired", defaultValue: false, value: "$el.prop:required" },
      { name: "maxLength", value: "$el.prop:maxLength" },
      { name: "watermark", value: "$el.prop:placeholder" }
    ],
    events: {
      "keyup": "checkEnterKey"
    },
    checkEnterKey: function (e) {
      e.keyCode == '13' ? this.$el.change() : $.noop();
    }

  });
});