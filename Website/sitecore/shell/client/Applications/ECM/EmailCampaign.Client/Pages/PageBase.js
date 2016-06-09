define([
  "sitecore",
  "/-/speak/v1/ecm/AppBase.js",
  "/-/speak/v1/ecm/DataBaseService.js",
  "/-/speak/v1/ecm/DialogService.js",
  "/-/speak/v1/ecm/Cookies.js"
], function (sitecore, appBase, dbService, DialogService) {
  var PageBase = appBase.extend({
    initialized: function () {
      this.bindAjaxErrorMessages();
      this.setTimezoneCookie();
      dbService.expectedDatabase('master').fail(this.isMasterDatabaseFail);
    },

    isMasterDatabaseFail: function () {
      DialogService.show('confirm', {
        title: sitecore.Resources.Dictionary.translate("ECM.Warning"),
        text: sitecore.Resources.Dictionary.translate("ECM.ThisApplicationRequiresMasterDatabase"),
        buttons: { cancel: { show: false }, close: { show: false } },
        on: {
          ok: function() {
            location.replace('/sitecore/shell/sitecore/client/Applications/Launchpad');
          }
        } 
      });
    },

    bindAjaxErrorMessages: function () {
      if (!this.MessageBar) {
        return;
      }

      sitecore.on('ajax:error', function (message) {
        if (!_.findWhere(this.MessageBar.get('errors'), { text: message.text })) {
          this.MessageBar.addMessage('error', message);
        }
      }, this);
    },

    setTimezoneCookie: function () {
      var timezoneCookie = "utcOffset";
      if (!$.cookie(timezoneCookie)) {
        $.cookie(timezoneCookie, new Date().getTimezoneOffset());
      }
      else {
        var storedOffset = parseInt($.cookie(timezoneCookie));
        var currentOffset = new Date().getTimezoneOffset();
        if (storedOffset !== currentOffset) {
          $.cookie(timezoneCookie, new Date().getTimezoneOffset());
        }
      }
    }
  });
  return PageBase;
});