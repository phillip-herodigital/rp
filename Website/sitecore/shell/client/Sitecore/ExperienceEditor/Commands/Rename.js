define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.Rename =
  {
    canExecute: function (context) {
      if (!Sitecore.ExperienceEditor.isInMode("edit")) {
        return false;
      }

      return context.app.canExecute("ExperienceEditor.Rename.CanRename", context.currentContext);
    },

    execute: function (context) {
      context.app.disableButtonClickEvents();
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.RenamePipeline, function () {
        Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.RenameItem, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});