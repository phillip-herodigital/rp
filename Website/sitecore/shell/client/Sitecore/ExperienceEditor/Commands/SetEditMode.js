define(["sitecore"], function (Sitecore) {
  var canEditMode;
  Sitecore.Commands.SetEditMode =
  {
    canExecute: function (context) {
      if (canEditMode == undefined) {
        context.button.set({ isPressed: Sitecore.ExperienceEditor.isInMode("edit") });
        canEditMode = context.app.canExecute("ExperienceEditor.EditMode.CanEdit", context.currentContext);
      }

      return canEditMode;
    },
    execute: function (context) {
      context.currentContext.value = encodeURIComponent(window.parent.location);
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.EditMode.SelectEdit", function (response) {
        window.parent.location = response.responseValue.value;
      }).execute(context);
    }
  };
});