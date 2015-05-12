define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    name: "ProgressBar",
    base: "ControlBase",
    selector: ".sc-progressbar",
    attributes: [
      { name: "maxValue", value: "$el.data:sc-maxvalue" },
      { name: "updateInterval", value: "$el.data:sc-updateinterval" },
      { name: "value", value: "$el.data:sc-value" },
      { name: "showLabel", value: "$el.data:sc-showlabel" }
    ],
    initialize: function () {
      this._super();
      this.model.on("change:value", this.updateLabel, this);
      this.model.on("change:updateInterval", this.setupTimer, this);
      this.setupTimer();
    },
    updateLabel: function () {
      var value = this.model.get("value");
      if (value > this.model.get("maxValue")) {
        this.model.set("value", this.model.get("maxValue"));
        return;
      }
      if (value < 0) {
        this.model.set("value", 0);
        return;
      }
    },
    setupTimer: function () {
      var updateInterval = this.model.get("updateInterval");
      clearInterval(this.timer);
      if (updateInterval <= 0) {
        return;
      }
      var id = this.$el.attr("data-sc-id");
      this.timer = setInterval(function () {
        _sc.trigger("intervalCompleted:" + id);
      }, updateInterval);
    }
  });
});