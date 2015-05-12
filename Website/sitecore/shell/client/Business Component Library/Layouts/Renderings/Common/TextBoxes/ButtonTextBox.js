define(["sitecore"], function (_sc) {
  _sc.Factories.createBaseComponent({
    base: "InputBase",
    name: "ButtonTextBox",
    selector: ".sc-buttontextbox",
    attributes: [
      { name: "text", value: "$el.attr:value" },
      { name: "isReadOnly", defaultValue: false, value: "$el.prop:readonly" },
      { name: "isRequired", defaultValue: false, value: "$el.prop:required" },
      { name: "maxLength", value: "$el.prop:maxLength" },
      { name: "clickScript", value: "$el.data:sc-click" },
      { name: "isEnabled", defaultValue: true }
    ],
    events: {
      "keypress": "checkEnterKey",
      "click": "preventIfDisable",
      "click .btn": "buttonClicked",
      "keyup input": "keyupPressed"
    },

    initialize: function () {           
      this.model.on("change:isEnabled", this.toggleEnable(this.model.get("isEnabled")), this);
    },

    keyupPressed: function (e) {
      if (e.keyCode == 13) {
        this.buttonClicked(e);
      }
    },

    buttonClicked: function (e) {
      this.preventIfDisable(e);
      var clickInvocation = this.model.get("clickScript");
      if (clickInvocation) {
        return _sc.Helpers.invocation.execute(clickInvocation, { app: this.app });
      }
      return null;
    },

    toggleEnable: function (isEnabled) {
      if (!isEnabled) {        
        this.$el.find("input").attr("disabled", "disabled");
        this.$el.find(".btn").attr("disabled", "disabled");
      } else {
        this.$el.find(".btn").removeAttr("disabled");
        this.$el.find("input").removeAttr("disabled");
      }
    },
    preventIfDisable: function (e) {
      if (e && !this.model.get("isEnabled")) {
        e.preventDefault();
      }
    },
    checkEnterKey: function (e) {
      if (e.keyCode === 13) {
        this.$el.blur().focus();
      }
    }
  });
});