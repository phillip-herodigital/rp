define([
    "sitecore",
    "/-/speak/v1/ecm/CompositeComponentBase.js"
], function(sitecore, CompositeComponentBase) {
    var model = sitecore.Definitions.Models.ControlModel.extend({});

    var view = CompositeComponentBase.view.extend({
        childComponents: [
            "Title",
            "LinkValue",
            "TextValue",
            "Description",
            "ComparisonText"
        ],

        initialize: function() {
            this._super();

            this.model.set("comparisonType", this.$el.data("sc-comparisontype"));
            this.model.set("title", this.children.Title.get("text"));
            this.model.set("description", this.children.Description.get("text"));
            this.model.set("comparisonText", this.children.ComparisonText.get("text"));
            this.model.on({
                "change:value": this.onChangeValue,
                "change:title": _.bind(this.onChangeTexts, this, { property: "title", name: this.childComponents[0] }),
                "change:description": _.bind(this.onChangeTexts, this, { property: "description", name: this.childComponents[3] }),
                "change:comparisonText": _.bind(this.onChangeTexts, this, { property: "comparisonText", name: this.childComponents[4] })
            }, this);
            this.model.set("value", this.$el.data("sc-value"));
        },

        onChangeValue: function() {
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

        onChangeTexts: function(params) {
            this.children[params.name].set("text", this.model.get(params.property));
        }
    });

    return sitecore.Factories.createComponent("ScoreCard", model, view, ".sc-ScoreCard");
});