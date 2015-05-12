define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.MovePage =
  {
    canExecute: function (context) {
      if (context.currentContext.isHome | !Sitecore.ExperienceEditor.isInMode("edit")) {
        return false;
      }

      return context.app.canExecute("ExperienceEditor.Move.CanMove", context.currentContext);
    },

    execute: function (context) {
      context.app.disableButtonClickEvents();
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.MovePagePipeline, function () {
        Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.MoveItem, context);
      });
      context.app.enableButtonClickEvents();
    }
  };
});