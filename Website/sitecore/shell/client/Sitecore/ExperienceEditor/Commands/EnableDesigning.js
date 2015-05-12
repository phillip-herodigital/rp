define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.EnableDesigning =
  {
    isEnabled: false,
    canExecute: function (context) {
      if (!Sitecore.ExperienceEditor.isInMode("edit")) {
        return false;
      }

      var canDesign = context.app.canExecute("ExperienceEditor.EnableDesigning.CanDesign", context.currentContext);
      if (!canDesign) {
        context.button.set("isChecked", "0");
      }
      var isChecked = context.button.get("isChecked") == "1";
      Sitecore.ExperienceEditor.PageEditorProxy.changeCapability("design", isChecked);
      this.isEnabled = canDesign && isChecked;
      Sitecore.Commands.ShowControls.reEvaluate();

      return canDesign;
    },
    execute: function (context) {
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Toggle", function (response) {
        response.context.button.set("isChecked", response.responseValue.value ? "1" : "0");
        Sitecore.Commands.EnableDesigning.isEnabled = response.responseValue.value == "1";
        Sitecore.ExperienceEditor.PageEditorProxy.changeCapability("design", response.context.button.get("isChecked") == "1");
        Sitecore.Commands.ShowControls.reEvaluate();
      }, { value: context.button.get("registryKey") }).execute(context);
    }
  };
});