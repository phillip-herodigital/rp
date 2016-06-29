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
        sessionStorage.managerRootId === 'null' ||
        sessionStorage.managerRootId === 'undefined'
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
    },

    openMessage: function (message) {
      if (message) {
        var url = message.get("url");
        if (url) {
          window.location.href = url;
        }
      }
    },

    deleteMessage: function (message, callback) {
      if (!message) {
        return;
      }

      var data = currentContext = {
        messageId: message.get("itemId"),
        messageName: message.get("name")
      };

      sitecore.Pipelines.DeleteMessage.execute({ currentContext: data, callback: callback });
    }
  });
  return ListPageBase;
});