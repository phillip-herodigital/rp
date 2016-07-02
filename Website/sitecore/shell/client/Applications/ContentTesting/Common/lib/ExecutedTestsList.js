require.config({
  baseUrl: '/sitecore/shell/client/Applications/ContentTesting/Common/lib'
});

define(["sitecore", "BindingUtil", "EditUtil", "DataUtil"], function (_sc, bindingUtil, editUtil, dataUtil) {
  return {
    ExecutedTestsList: function (options) {
      var mod = {
        _host: options.host,

        init: function () {
          this._host.TestsList.on("change:selectedItemId change:selectedLanguage", this.selectionChanged, this);
        },

        selectionChanged: function () {
          var selected = this._host.TestsList.get("selectedItem");

          var hostUri = selected.get("HostPageUri");
          if (!hostUri) {
            return;
          }

          if (selected.get("ContentOnly") && selected.get("TestType") != "Personalization") {
            editUtil.openPageTestPage(hostUri, false, true);
          }
          else {
            editUtil.openPageEditor(hostUri);
          }
        }
      };

      mod.init();
      return mod;
    }
  };
});