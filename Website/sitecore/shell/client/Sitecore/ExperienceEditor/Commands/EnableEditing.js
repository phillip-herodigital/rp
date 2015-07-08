define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.EnableEditing =
  {
    isEnabled: false,
    canExecute: function (context) {
      if (!Sitecore.ExperienceEditor.isInMode("edit")) {
        return false;
      }
      var isChecked = context.button.get("isChecked") == "1";
      Sitecore.ExperienceEditor.PageEditorProxy.changeCapability("edit", isChecked);
      var canEdit = context.app.canExecute("ExperienceEditor.EnableEditing.CanEdit", context.currentContext);
      this.isEnabled = isChecked && canEdit;
      Sitecore.Commands.ShowControls.reEvaluate();

      return canEdit;
    },
    execute: function (context) {
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Toggle", function (response) {
        response.context.button.set("isChecked", response.responseValue.value ? "1" : "0");
        Sitecore.Commands.EnableEditing.isEnabled = response.responseValue.value == "1";
        Sitecore.ExperienceEditor.PageEditorProxy.changeCapability("edit", response.context.button.get("isChecked") == "1");
        Sitecore.Commands.ShowControls.reEvaluate();
      }, { value: context.button.get("registryKey") }).execute(context);
    }
  };
});