define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.Search =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      context.currentContext.value = "/sitecore/shell/Applications/Dialogs/Web%20Edit%20Search.aspx?";
      context.app.disableButtonClickEvents();
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.SearchPipeline, function () {
        Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.Search, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});