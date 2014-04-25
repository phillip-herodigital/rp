define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "IconHyperlinkButton",
    base: "ButtonBase",
    selector: ".sc-iconhyperlinkbutton",
    attributes: [
      { name: "text", defaultValue: "" },
      { name: "imageUrl",  defaultValue:"" },
      { name: "backgroundPosition", defaultValue: "center" }
    ],
    initialize: function () {
      this._super();
      
      this.model.set("text", this.$el.find(".sc-hyperlink-text").text());
      this.model.set("imageUrl", this.$el.find(".sc-icon").attr("data-sc-imageUrl"));
      this.model.set("backgroundPosition", this.$el.find(".sc-icon").attr("data-sc-backgroundPosition"));
      
      this.$el.attr("data-sc-href", this.$el.attr("href"));
      !this.model.get("isEnabled") ? this.$el.removeAttr('href') : $.noop();
      this.model.on("change:isEnabled", this.enabledChange, this);
    },
    events: {
      "click":"preventIfDisable"
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
    }

  });
});