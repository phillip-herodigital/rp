define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.OpenAttributes =
  {
    canExecute: function (context) {
      return context.app.canExecute("ExperienceEditor.OpenTrackingField.CanOpen", context.currentContext);
    },
    execute: function (context) {
      context.currentContext.value = "/sitecore/shell/~/xaml/Sitecore.Shell.Applications.Analytics.TrackingField.aspx";
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.OpenTrackingFieldPipeline, function () {
        Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.OpenTrackingField, context);
      });
    }
  };
});