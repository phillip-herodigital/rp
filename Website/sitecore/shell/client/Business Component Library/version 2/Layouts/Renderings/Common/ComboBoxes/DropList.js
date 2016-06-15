(function (speak) {

  require.config({
    paths: {
      collection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Collection",
      selection: "/sitecore/shell/client/Business Component Library/version 2/Layouts/Renderings/Mixins/Selection"
    }
  });

  speak.component(["collection", "selection"], function (Collection, Selection) {
    return speak.extend({}, Collection.prototype, Selection.prototype, {
      name: "DropList",

      initialized: function () {
        Collection.prototype.initialized.call(this);
        Selection.prototype.initialized.call(this);
      }
    });
  }, "DropList");
})(Sitecore.Speak);