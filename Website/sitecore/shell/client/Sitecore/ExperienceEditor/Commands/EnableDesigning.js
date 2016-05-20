define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js", "/-/speak/v1/ExperienceEditor/ExperienceEditorProxy.js"], function (Sitecore, ExperienceEditor, ExperienceEditorProxy) {
  Sitecore.Commands.EnableDesigning =
  {
    isEnabled: false,
    canExecute: function (context) {
      if (!ExperienceEditor.isInMode("edit") || context.currentContext.isFallback) {
        return false;
      }

      context.currentContext.value = context.button.get("registryKey");
      var canDesign = context.app.canExecute("ExperienceEditor.EnableDesigning.CanDesign", context.currentContext);
      if (!canDesign) {
        context.button.set("isChecked", "0");
      }
      var isChecked = context.button.get("isChecked") == "1";
      ExperienceEditorProxy.changeCapability("design", isChecked);
      this.isEnabled = canDesign && isChecked;
      Sitecore.Commands.ShowControls.reEvaluate();

      return canDesign;
    },
    execute: function (context) {
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Toggle", function (response) {
        response.context.button.set("isChecked", response.responseValue.value ? "1" : "0");
        Sitecore.Commands.EnableDesigning.isEnabled = response.responseValue.value == "1";
        ExperienceEditorProxy.changeCapability("design", response.context.button.get("isChecked") == "1");
        Sitecore.Commands.EnableDesigning.refreshAddComponentButtonState(response.context);
        Sitecore.Commands.ShowControls.reEvaluate();
      }, { value: context.button.get("registryKey") }).execute(context);
    },

    refreshAddComponentButtonState: function(context) {
      if (Sitecore.Commands.AddComponent) {
        var addComponents = ExperienceEditor.CommandsUtil.getControlsByCommand(ExperienceEditor.getContext().instance.Controls, "AddComponent");
        var buttonEnabled = Sitecore.Commands.AddComponent.canExecute(context);
        $.each(addComponents, function () {
          this.model.set({ isEnabled: buttonEnabled });
        });
      }
    }
  };
});