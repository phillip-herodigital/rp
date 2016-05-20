define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.SelectMode =
  {
    canExecute: function (context, parent) {
      if (!context.button) {
        return context.app.canExecute("ExperienceEditor.Mode.CanSelectMode", context.currentContext);
      }

      if (!ExperienceEditor.isInMode("edit")) {
        context.button.set({ isPressed : true });
      }

      return true;
    },

    execute: function (context) {
      context.currentContext.value = encodeURIComponent(context.currentContext.argument + "|" + window.parent.location);
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Mode.SelectModeRequest", function (response) {
        window.parent.location = response.responseValue.value;
      }).execute(context);
    }
  };
});