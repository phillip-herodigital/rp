require.config({
  paths: {
    bindingUtil: "/-/speak/v1/contenttesting/BindingUtil",
    editUtil: "/-/speak/v1/contenttesting/EditUtil"
  }
});

define(["sitecore", "bindingUtil", "editUtil"], function (_sc, bindingUtil, editUtil) {
  return {
    SuggestedTestsList: function (options) {
      var mod = {
        _host: options.host,

        init: function () {
          /*this._host.TestsDataSource.on("change:totalResults", bindingUtil.propagateChange, {
            source: this._host.TestsDataSource,
            sourceProp: "totalResults",
            target: this._host.ListAccordion,
            targetProp: "header",
            prefix: this._host.ListAccordion.get("header") + " (",
            postfix: ")"
          });*/

          this._host.TestsList.on("change:selectedItemId", this.selectionChanged, this);
        },

        selectionChanged: function () {
          var selected = this._host.TestsList.get("selectedItem");
          var hostId = selected.get("HostPageId");
          var language = selected.get("Language");
          if (!hostId) {
            return;
          }

          editUtil.openPageEditor(hostId, language);
        }
      }

      mod.init();
      return mod;
    }
  };
});