define([
  "sitecore",
  "/-/speak/v1/ecm/AppBase.js",
  "/-/speak/v1/ecm/DataBaseService.js",
  "/-/speak/v1/ecm/DialogService.js"
], function (sitecore, appBase, dbService, DialogService) {
  var PageBase = appBase.extend({
    initialized: function () {
      this.bindAjaxErrorMessages();
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

      sitecore.on('ajax:error', function (jqXHR) {
        switch (jqXHR.status) {
          case 500:
            if (!_.findWhere(this.MessageBar.get('errors'), { id: 'ajax.error.500' })) {
              this.MessageBar.addMessage('error', { id: 'ajax.error.500', text: sitecore.Resources.Dictionary.translate("ECM.WeAreVerySorryButThereHasBeenAProblem"), actions: [], closable: true });
            }
            break;
        }
      }, this);
    }
  });
  return PageBase;
});