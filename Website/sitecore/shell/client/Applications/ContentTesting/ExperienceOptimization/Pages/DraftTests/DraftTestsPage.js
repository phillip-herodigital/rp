require.config({
  paths: {
    bindingUtil: "/-/speak/v1/contenttesting/BindingUtil",
    editUtil: "/-/speak/v1/contenttesting/EditUtil"
  }
});

define(["sitecore", "bindingUtil", "editUtil"], function (_sc, bindingUtil, editUtil) {
  var DraftTests = _sc.Definitions.App.extend({
    initialized: function () {
      this.TestsList.on("change:selectedItemId", this.selectionChanged, this);

      this.TestsDataSource.set("currentPage", this);
    },

    selectionChanged: function () {
      var hostId = this.TestsList.get("selectedItem").get("HostPageId");
      if (!hostId) {
        return;
      }

      editUtil.openPageTestPage(hostId, false, true);
    }
  });

  return DraftTests;
});