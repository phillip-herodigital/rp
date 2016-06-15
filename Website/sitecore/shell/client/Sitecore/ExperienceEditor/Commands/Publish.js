define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.Publish =
  {
    canExecute: function (context) {
      return context.app.canExecute("ExperienceEditor.Publish.CanPublish", context.currentContext);
    },
    execute: function (context) {
      ExperienceEditor.modifiedHandling(true, function (isOk) {
        ExperienceEditor.PipelinesUtil.executePipeline(context.app.PublishPipeline, function () {
          ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.Publish, context);
        });
      });
    }
  };
});