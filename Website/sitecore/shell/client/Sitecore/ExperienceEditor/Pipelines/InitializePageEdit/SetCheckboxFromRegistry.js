define(["sitecore"], function (Sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      $.each(context.app, function () {
        if (this.attributes === undefined
            || this.componentName !== "SmallCheckButton"
            || this.get("registryKey") === null
            || this.get("registryKey") === "")
          return;
        var button = this;
        Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Get", function (response) {
          button.set("isChecked", response.responseValue.value ? "1" : "0");
        }, { value: this.get("registryKey") }).execute(context);
      });
    }
  };
});