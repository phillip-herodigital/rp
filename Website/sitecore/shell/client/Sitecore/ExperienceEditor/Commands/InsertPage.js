define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.InsertPage =
  {
    canExecute: function (context) {
      if (!Sitecore.ExperienceEditor.isInMode("edit")) {
        return false;
      }

      return context.app.canExecute("ExperienceEditor.Insert.CanInsert", context.currentContext);
    },
    execute: function (context) {
      context.app.disableButtonClickEvents();
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.InsertItemPipeline, function () {
        Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.InsertItem, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});