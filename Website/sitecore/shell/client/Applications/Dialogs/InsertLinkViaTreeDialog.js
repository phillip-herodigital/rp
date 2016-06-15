define(["sitecore"], function(Sitecore) {
  var InsertLinkViaTreeDialog = Sitecore.Definitions.App.extend({
    initialized: function () {

      this.updateCustomUrl();

      this.Target.on("change", function () {
        this.updateCustomUrl();
      }, this);

      // work around an issue in combobox
      this.TargetsDataSource.on("change:items", function () {
        if (this.__firstTime) {
          this.__firstTime = false;
          this.Target.set("selectedValue", this.TargetLoadedValue.get("text"));
        }
      }, this);
    },
      
    updateCustomUrl: function () {

      var emptyOptionID = "{A3C9DB39-1D1B-4AA1-8C68-7B9674D055EE}";
      var customUrlOptionID = "{07CF2A84-9C22-4E85-8F3F-C301AADF5218}";

      var targetWindowValue = this.Target.get("selectedItem");

      if (!targetWindowValue || targetWindowValue.itemId === emptyOptionID) {
        this.CustomUrl.set("isEnabled", false);
        return;
      }

      if (targetWindowValue.itemId === customUrlOptionID) {
        this.CustomUrl.set("isEnabled", true);
      } else {
        this.CustomUrl.set("isEnabled", false);
      }
    },
        
    __firstTime: true

  });

  return InsertLinkViaTreeDialog;
});