require.config({
  baseUrl: '/sitecore/shell/client/Applications/ContentTesting/Common/lib'
});

define(["sitecore", "BindingUtil", "EditUtil", "DataUtil"], function (_sc, bindingUtil, editUtil, dataUtil) {
  return {
    SuggestedTestsList: function (options) {
      var mod = {
        _host: options.host,

        init: function () {
          this._host.TestsList.on("change:selectedItemId", this.selectionChanged, this);
        },

        selectionChanged: function () {
          var selected = this._host.TestsList.get("selectedItem");

          var hostUri = selected.get("HostPageUri");
          if (!hostUri) {
            return;
          }

          editUtil.openPageEditor(hostUri);
        }
      }

      mod.init();
      return mod;
    }
  };
});