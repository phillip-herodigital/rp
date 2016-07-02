define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.SaveProfile =
  {
    canExecute: function (context) {
      var isProfiling = Sitecore.ExperienceEditor.isDebugging() && Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_prof") == "1";
      return Sitecore.ExperienceEditor.canToggleDebug() && isProfiling;
    },
    execute: function (context) {
      context.currentContext.value = Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_prf");
      context.app.disableButtonClickEvents();
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.SaveDebugProfile, function () {
        Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.SaveDebugProfile, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});