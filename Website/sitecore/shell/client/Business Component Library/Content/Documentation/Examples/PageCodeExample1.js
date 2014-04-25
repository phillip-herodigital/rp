define(["sitecore"], function (_sc) {
  var items = [
    {
      $displayName: "Item Buckets",
      $templateName: "Template Folder",
      __Created: "Thursday, October 27, 2011 2:37 PM",
      itemId: "{AB323CEF-9997-47D7-A070-CDC1177D82B0}",
      itemName: "Item Buckets"
    },
    {
      $displayName: "Item Buckets",
      $templateName: "Template Folder",
      __Created: "Wednesday, October 26, 2011 2:37 PM",
      itemId: "{AB323CEF-9997-47D7-A070-CDC1177D82BD}",
      itemName: "Item Buckets"
    }
  ];
  var App = _sc.Definitions.App.extend({
    initialized: function () {
      this.ListControl.set("items", items);
    },
    changeHeaderText: function () {
      this.HeaderText.set("text", "New Changed Header");
    },
    clearList: function () {
      this.ListControl.set("items", []);
    },
    fillList: function () {
      this.ListControl.set("items", items);
    }
  });
  return App;
});
