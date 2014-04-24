/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (Sitecore) {

  Sitecore.Factories.createBaseComponent({
    name: "Repeater",
    base: "ControlBase",
    selector: ".sc-repeater",
    attributes: [
            { name: "items", defaultValue: [] },
            { name: "isLoading", defaultValue: false }
    ],
    extendModel: {
        add: function (item) {
            this.trigger("addItem", item);
        },
        remove: function (app) {
            this.trigger("removeItem", app);
        },
        getItem: function (app) {
          var rndrObject = this.RenderedItems.find(function (renderedObj) {
            return renderedObj.get("app") === app;
          });

          return rndrObject.get("item");
        }
    },
    initialize: function () {
        this.model.on("change:items", this.renderItems, this);
        this.model.on("addItem", this.add, this);
        this.model.on("removeItem", this.remove, this);
        this.model.RenderedItems = new Backbone.Collection();
    },
    add: function (item) {
      this.model.get("items").push(item);
      this.renderItem(item);
    },
    remove: function (app) {
      var renderedItem = this.model.RenderedItems.find(function (renderedApp) {
            return renderedApp.get("app") === app;
        });
        renderedItem.get("app").ScopedEl.empty();
        renderedItem.get("app").destroy();
        this.model.RenderedItems.remove(renderedItem);
    },
    renderItem: function (item) {
        var app = this.app,
            model = this.model,
            self = this;

        this.model.set("isLoading", true);

        this.app.insertRendering(item.itemId, { $el: this.$el, database: item.$database }, function (app) {
            //self.model.get("items").push(item);
            self.model.RenderedItems.add({ item: item, app: app });
            self.model.set("isLoading", false);
        });
    },
    renderItems: function () {
        this.reset();
        var self = this;               
      _.each(this.model.get("items"), function (item) {
        this.renderItem(item);
      }, this);
    },
    reset: function () {
      this.model.RenderedItems.each(function (app) {
          app.destroy();
      });
      this.model.RenderedItems.reset();
      this.$el.empty();
    }
  });
});
