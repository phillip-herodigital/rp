define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "HyperlinkButton",
    base: "ButtonBase",
    selector: ".sc-hyperlinkbutton",
    attributes: [
      { name: "text", value: "$el.text" },
      { name: "isEnabled", value: "$el.data:sc-enabled", defaultValue: true },
      { name: "isButtonMode", value: "$el.data:sc-isbuttonmode", defaultValue: false }
    ],
    events: {
      "click": "preventIfDisable"
    },
    preventIfDisable: function (e) {
      if (e && !this.model.get("isEnabled")) {
        e.preventDefault();
      }
    },
    enabledChange: function () {
      this.model.get("isEnabled") ?
        this.$el.attr("href", this.$el.attr("data-sc-href")) :
        this.$el.removeAttr("href");
    },
    initialize: function () {
      this._super();
      this.$el.attr("data-sc-href", this.$el.attr("href"));
      !this.model.get("isEnabled") ? this.$el.removeAttr('href') : $.noop();
      this.model.on("change:isEnabled", this.enabledChange, this);
    }

  });
});
