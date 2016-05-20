define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"], function (Sitecore, ExperienceEditor, ExperienceEditorProxy) {
  Sitecore.Commands.EnableEditing =
  {
    isEnabled: false,
    canExecute: function (context) {
      if (!ExperienceEditor.isInMode("edit") || context.currentContext.isFallback) {
        return false;
      }
      var isChecked = context.button.get("isChecked") == "1";
      ExperienceEditorProxy.changeCapability("edit", isChecked);
      context.currentContext.value = context.button.get("registryKey");
      var canEdit = context.app.canExecute("ExperienceEditor.EnableEditing.CanEdit", context.currentContext);
      this.isEnabled = isChecked && canEdit;
      Sitecore.Commands.ShowControls.reEvaluate();

      return canEdit;
    },
    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Toggle", function (response) {
        response.context.button.set("isChecked", response.responseValue.value ? "1" : "0");
        Sitecore.Commands.EnableEditing.isEnabled = response.responseValue.value == "1";
        ExperienceEditorProxy.changeCapability("edit", response.context.button.get("isChecked") == "1");
        Sitecore.Commands.ShowControls.reEvaluate();
        Sitecore.Commands.EnableFieldsValidation.reEvaluate(context);
      }, { value: context.button.get("registryKey") }).execute(context);
    }
  };
});