require.config({
  paths: {
    bindingUtil: "/-/speak/v1/contenttesting/BindingUtil",
    editUtil: "/-/speak/v1/contenttesting/EditUtil",
    loadingImage: "/sitecore/shell/client/Sitecore/ContentTesting/LoadingImage"
  }
});

define(["sitecore", "bindingUtil", "editUtil", "loadingImage"], function (_sc, bindingUtil, editUtil, loadingImage) {
  var DraftTests = _sc.Definitions.App.extend({
    initialized: function () {
      this.TestsList.on("change:selectedItemId", this.selectionChanged, this);

      this.TestsDataSource.set("currentPage", this);

      $(document).ready(function () {
        loadingImage.hideElement();
      });
    },

    selectionChanged: function () {
      var selected = this.TestsList.get("selectedItem");
      var hostId = selected.get("HostPageId");
      var language = selected.get("Language");
      if (!hostId) {
        return;
      }

      editUtil.openPageTestPage(hostId, false, true, language);
    }
  });

  loadingImage.showElement();
  return DraftTests;
});