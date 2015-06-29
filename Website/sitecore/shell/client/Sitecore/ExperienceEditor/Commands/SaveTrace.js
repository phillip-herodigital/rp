define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.SaveTrace =
  {
    canExecute: function (context) {
      var isTracing = Sitecore.ExperienceEditor.isDebugging() && Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_trace") == "1";
      return Sitecore.ExperienceEditor.canToggleDebug() && isTracing;
    },
    execute: function (context) {
      context.currentContext.value = Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_trf");
      context.app.disableButtonClickEvents();
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.SaveDebugTrace, function () {
        Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.SaveDebugTrace, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});