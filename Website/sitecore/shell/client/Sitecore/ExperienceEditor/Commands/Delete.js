define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.Delete =
  {
    canExecute: function (context) {
      if (context.currentContext.isHome | !Sitecore.ExperienceEditor.isInMode("edit")) {
        return false;
      }
      return context.app.canExecute("ExperienceEditor.Delete.CanDelete", context.currentContext);
    },
    execute: function (context) {
      context.app.disableButtonClickEvents();
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.DeleteItemPipeline, function () {
        Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.DeleteItem, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});

