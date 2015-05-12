define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.OpenPresets =
  {
    canExecute: function (context) {
      if (!Sitecore.ExperienceEditor.isInMode("edit")) {
        return false;
      }

      return context.app.canExecute("ExperienceEditor.LayoutPresets.CanOpen", context.currentContext);
    },
    execute: function (context) {
      context.app.disableButtonClickEvents();
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.LayoutPresetsPipeline, function () {
        Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.LayoutPresets, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});