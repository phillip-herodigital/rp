define([
  "sitecore",
  "/-/speak/v1/ecm/PageBase.js",
  "/-/speak/v1/ecm/DialogService.js",
  "/-/speak/v1/ecm/PrimaryNavigation.js"
], function(
  sitecore,
  PageBase,
  DialogService,
  PrimaryNavigation
) {
  var ListPageBase = PageBase.extend({
    initialized: function () {
      this._super();
      //set up default navigation dialogs
      PrimaryNavigation.initializePrimaryNavigation(this, sitecore);
      this.initDefaultSettingsDialog();
    },
    initDefaultSettingsDialog: function () {
      if (
        !sessionStorage.managerRootId ||
        sessionStorage.managerRootId === 'null'
        ) {
        DialogService.get('defaultSettings')
          .done(function(dialog) { dialog.firstrun(); });
      }

      if (sessionStorage.firstrun) {
        sessionStorage.removeItem("firstrun");
        DialogService.show('defaultSettings');
      }
      
      this.on("action:defaultsettings", function() {
        DialogService.show('defaultSettings');
      }, this);
    }
  });
  return ListPageBase;
});