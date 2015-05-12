define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.SelectDevice =
  {
    canExecute: function (context) {
      if (!context.button) {
        return context.app.canExecute("ExperienceEditor.Device.HasDeviceLayout", context.currentContext);
      }

      return true;
    },
    execute: function (context) {
      context.currentContext.value = encodeURIComponent(context.currentContext.argument + "|" + window.parent.location);
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Device.SelectSevice", function (response) {
        window.parent.location = response.responseValue.value;
      }).execute(context);
    }
  };
});