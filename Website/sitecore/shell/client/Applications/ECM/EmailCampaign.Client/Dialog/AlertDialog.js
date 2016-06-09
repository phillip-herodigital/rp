define(["sitecore", "/-/speak/v1/ecm/DialogBase.js"], function (sitecore, DialogBase) {
  return DialogBase.extend({
    initialized: function () {
      this._super();
      this.defaults.text = this.Text.get("text");
    },

    update: function () {
      this.Text.set("text", this.options.text);
      this._super();
    },

    resetDefaults: function () {
      this.Text.set("text", this.defaults.text);
      this._super();
    }
  });
});