define(["sitecore"], function (sitecore) {
  var dbBrowser = sitecore.Definitions.App.extend({
    initialized: function () {
      require(["css!/-/speak/v1/client/DBBrowser.css"]);
      
      this.on("item:delete", this.delete, this);
      this.on("item:rename", this.rename, this);
      this.on("item:save", this.save, this);
    },

    delete: function () {
      if (!confirm("Are you sure you want to delete this item?")) {
        return;
      }
      
      var item = this.DBBrowserEditor.get("item");
      item.sync("delete");
    },

    rename: function () {
      var newName = this.RenameTextBox.get("text");

      var item = this.DBBrowserEditor.get("item");

      item.rename(newName, function (data) {
        this.DataSource.refresh();
      }, this);
    },

    save: function () {
      var item = this.DBBrowserEditor.get("item");
      item.sync("update");

      alert("Saved!");
    }
  });

  return dbBrowser;
});
