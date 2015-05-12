define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.DisplayName =
  {
    canExecute: function (context) {
      if (!Sitecore.ExperienceEditor.isInMode("edit")) {
        return false;
      }

      return context.app.canExecute("ExperienceEditor.CanChangeDisplayName", context.currentContext);
    },
    execute: function (context) {
      context.app.disableButtonClickEvents();
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.ChangeDisplayNamePipeline, function () {
        Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.DisplayName, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});