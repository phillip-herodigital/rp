/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />

define(["sitecore"], function (_sc) {
    _sc.Factories.createBaseComponent({
        name: "RadioButton",
        base: "InputBase",
        selector: ".sc-radiobutton",
        attributes: [
            { name: "name", defaultValue: "" },
            { name: "value", defaultValue: "" },
            { name: "text", defaultValue: "" },
            { name: "isChecked", defaultValue: false}
        ],
        extendModel: {
            check: function () {
                this.set("isChecked", this.get("value"));
            },
            uncheck: function () {
                this.set("isChecked", false);
            }
        },
        events: {
            "click": "_changeStatus"
        },
        initialize: function (options) {
            this._super();

            this.input = this.$el.find(".sc-radiobutton-input");
            this.label = this.$el.find(".sc-radiobutton-label");

            this.model.set("name", this.input.prop("name"));
            var value = this.input.val();

            this.model.set("value", value);
            this.model.set("text", this.label.text());

            this._changeStatus();
            this._setGlobalValue();

            this.model.on("change:isChecked", this._setGlobalValue, this);
        },
        _changeStatus: function () {
            if(this.input.is(":checked")) {
                this.model.set("isChecked", this.model.get("value"));
            } else {
                this.model.set("isChecked", false);
            }
        },
        _setGlobalValue: function () {
            if (this.model.get("isChecked") === this.model.get("value")) {
                this.app.set(this.model.get("name"), this.model.get("value"));
            }
        }
    });
});