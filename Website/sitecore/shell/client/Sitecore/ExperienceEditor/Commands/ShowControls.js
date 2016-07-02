define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.ShowControls =
  {
    commandContext: null,
    isEnabled: false,
    reEvaluate: function () {
      this.canExecute(Sitecore.Commands.ShowControls.commandContext);
      if (Sitecore.Commands.ShowControls.commandContext) {
        Sitecore.Commands.ShowControls.commandContext.button.set("isEnabled", this.isEnabled);
      }
    },
    canExecute: function (context) {
      if (!Sitecore.ExperienceEditor.isInMode("edit")
        || !context
        || !context.button) {
        return false;
      }

      var isAllowed = (Sitecore.Commands.EnableEditing && Sitecore.Commands.EnableEditing.isEnabled) || (Sitecore.Commands.EnableDesigning && Sitecore.Commands.EnableDesigning.isEnabled);
      Sitecore.ExperienceEditor.PageEditorProxy.changeShowControls(context.button.get("isChecked") == "1" && isAllowed);
      if (!Sitecore.Commands.ShowControls.commandContext) {
        Sitecore.Commands.ShowControls.commandContext = Sitecore.ExperienceEditor.instance.clone(context);
      }

      this.isEnabled = isAllowed;
      return this.isEnabled;
    },
    execute: function (context) {
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Toggle", function (response) {
        response.context.button.set("isChecked", response.responseValue.value ? "1" : "0");
        Sitecore.ExperienceEditor.PageEditorProxy.changeShowControls(response.context.button.get("isChecked") == "1");
      }, { value: context.button.get("registryKey") }).execute(context);
    }
  };
});