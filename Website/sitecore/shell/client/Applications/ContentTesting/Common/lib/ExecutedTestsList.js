﻿require.config({
  paths: {
    bindingUtil: "/-/speak/v1/contenttesting/BindingUtil",
    editUtil: "/-/speak/v1/contenttesting/EditUtil"
  }
});

define(["sitecore", "bindingUtil", "editUtil"], function (_sc, bindingUtil, editUtil) {
  return {
    ExecutedTestsList: function (options) {
      var mod = {
        _host: options.host,

        init: function () {
          this._host.TestsList.on("change:selectedItemId", this.selectionChanged, this);
        },

        selectionChanged: function () {
          var selected = this._host.TestsList.get("selectedItem");
          var hostId = selected.get("HostPageId")
          if (!hostId) {
            return;
          }

          if (selected.get("ContentOnly")) {
            editUtil.openPageTestPage(hostId, false, true);
          }
          else {
            editUtil.openPageEditor(hostId);
          }
        }
      };

      mod.init();
      return mod;
    }
  };
});