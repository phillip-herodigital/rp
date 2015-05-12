define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.ExplorerMode =
  {
    canExecute: function (context) {
      return context.app.canExecute("ExperienceExplorer.ExplorerMode.CanExplore", context.currentContext);
    },

    execute: function (context) {
      context.currentContext.value = encodeURIComponent(window.parent.location);
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceExplorer.ExplorerMode.Explore", function (response) {
        window.parent.location = response.responseValue.value;
      }).execute(context);
    }
  };
});