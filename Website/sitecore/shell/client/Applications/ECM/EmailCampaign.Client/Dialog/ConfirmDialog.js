define(["sitecore", "/-/speak/v1/ecm/AlertDialog.js"], function (sitecore, AlertDialog) {
  return AlertDialog.extend({
    initialized: function () {
      this._super();
      this.defaults.showIcon = true;
    },
    
    update: function() {
      this.Icon.set("isVisible", this.options.showIcon);
      this._super();
    },

    resetDefaults: function () {
      this.Icon.set("isVisible", this.defaults.showIcon);
      this._super();
    }
  });
});