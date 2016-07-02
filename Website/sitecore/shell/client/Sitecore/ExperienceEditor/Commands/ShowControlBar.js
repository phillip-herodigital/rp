define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.ShowControlBar =
  {
    canExecute: function (context) {
      if (!Sitecore.ExperienceEditor.isInMode("edit")) {
        return false;
      }

      var isVisible = context.button.get("isChecked") == "1";
      scControlBar = isVisible;
      Sitecore.ExperienceEditor.PageEditorProxy.controlBarStateChange();
      return context.app.canExecute("ExperienceEditor.ControlBar.CanEnable", context.currentContext);
    },
    execute: function (context) {
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleRegistryKey.Toggle", function (response) {
        response.context.button.set("isChecked", response.responseValue.value ? "1" : "0");
        scControlBar = response.responseValue.value;
        Sitecore.ExperienceEditor.PageEditorProxy.controlBarStateChange();
      }, { value: context.button.get("registryKey") }).execute(context);
    }
  };
});