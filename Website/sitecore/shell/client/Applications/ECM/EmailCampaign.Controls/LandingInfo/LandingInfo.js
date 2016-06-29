define([
  "sitecore",
  "/-/speak/v1/ecm/CompositeComponentBase.js"
], function (sitecore, CompositeComponentBase) {
  var model = sitecore.Definitions.Models.ControlModel.extend({ });

  var view = CompositeComponentBase.view.extend({
    childComponents: ["Icon", "Title", "TextValue", "LinkValue", "Description"],

    initialize: function () {
      this._super();
      this.model.set("icon", this.children.Icon.get("imageUrl"));
      this.model.set("title", this.children.Title.get("text"));
      this.model.on({        
        "change:icon": this.updateIcon,
        "change:value": this.updateValue,
        "change:title": this.updateTitle,
        "change:description": this.updateDescription
      }, this);
      this.model.set("value", this.$el.data("sc-value"));     
      this.children.TextValue.set("isVisible", true);
      this.updateDescription();
    },
    
    updateIcon: function () {
      this.children.Icon.set("isVisible", !!this.model.get("icon"));
      this.children.Icon.set("imageUrl", this.model.get("icon"));
    },
    
    updateValue: function () {
      var value = this.model.get("value");
      if (value && $.type(value) === 'object') {
        this.children.LinkValue.set("text", value.title || '');
        this.children.LinkValue.set("navigateUrl", value.url || '');
        this.children.LinkValue.set("isVisible", true);
      } else {
        this.children.TextValue.set("text", value || '');
        this.children.LinkValue.set("isVisible", false);
      }
    },

    updateTitle: function () {
        this.children.Title.set('text', this.model.get('title'));
    },
    
    updateDescription: function () {
        var description = this.model.get('description');
        if (!description) {
            this.$el.addClass("no-description");
            this.children.Description.set('text', '');
        } else {
            this.$el.removeClass("no-description");
            this.children.Description.set('text', description);
        }
    }
  });

  return sitecore.Factories.createComponent("LandingInfo", model, view, ".sc-LandingInfo");
});