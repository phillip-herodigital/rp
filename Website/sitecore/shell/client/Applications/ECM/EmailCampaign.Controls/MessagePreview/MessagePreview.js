define([
  "sitecore",
  "/-/speak/v1/ecm/CompositeComponentBase.js"
], function (sitecore, CompositeComponentBase) {
  var model = sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
    }
  });

  var view = CompositeComponentBase.view.extend({
    childComponents: [
      "Image",
      "ImageText"
    ],

    initialize: function () {
      this._super();
      this.attachEventHandlers();
      this.model.set("imageUrl", this.$el.data("sc-imageurl") || "");
      this.model.set("imageText", this.$el.data("sc-imagetext") || "");
    },
    attachEventHandlers: function () {
      this.model.on({
        "change:imageUrl": function () {
          this.children.Image.set("imageUrl", this.model.get("imageUrl"));
        },
        "change:imageText": function () {
          this.children.ImageText.set("text", this.model.get("imageText"));
        },
      }, this);
    }
  });

  sitecore.Factories.createComponent("MessagePreview", model, view, ".sc-MessagePreview");
});
