define([
    "sitecore",
    "/-/speak/v1/ecm/CompositeComponentBase.js"
], function(sitecore, CompositeComponentBase) {

    var model = sitecore.Definitions.Models.ControlModel.extend({});

    var view = CompositeComponentBase.view.extend({
        childComponents: [
            "Expander",
            "ProgressIndicator",
            "Actions",
            "BottomLinkBorder"
        ],

        initialize: function() {
            this._super();

            this.model.set("title", this.children.Expander.get("header"));
            this.model.on({
                "change:title": this.onChangeTitle,
                "change:isBusy": this.onChangeIsBusy
            }, this);
            this.model.set("isBusy", this.$el.data("sc-isbusy"));
        },

        onChangeTitle: function() {
            this.children.Expander.set("header", this.model.get("title"));
        },

        onChangeIsBusy: function() {
            this.children.ProgressIndicator.set("isBusy", this.model.get("isBusy"));
            if (this.children.Actions) {
                this.children.Actions.set("isEnabled", !this.model.get("isBusy"));
            }
        }
    });

    return sitecore.Factories.createComponent("Card", model, view, ".sc-exm-Card");
});