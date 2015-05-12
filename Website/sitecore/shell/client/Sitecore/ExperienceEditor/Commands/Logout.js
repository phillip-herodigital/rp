define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.Logout =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.LogoutPipeline, function () {
        Sitecore.Pipelines.Logout.execute(context);
      });
    }
  };
});