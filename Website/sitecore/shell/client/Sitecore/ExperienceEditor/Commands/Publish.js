define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.Publish =
  {
    canExecute: function (context) {
      return context.app.canExecute("ExperienceEditor.Publish.CanPublish", context.currentContext);
    },
    execute: function (context) {
      Sitecore.ExperienceEditor.modifiedHandling(true, function (isOk) {
        Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.PublishPipeline, function () {
          Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.Publish, context);
        });
      });
    }
  };
});