define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.AspNetTrace =
  {
    canExecute: function (context) {
      return context.app.canExecute("ExperienceEditor.AspNetTrace.CanOpen", context.currentContext) && Sitecore.ExperienceEditor.canToggleDebug();
    },
    execute: function (context) {
      window.open('/trace.axd', '_blank', 'location=0,menubar=0,status=0,toolbar=1,resizable=1,scrollbars=yes');
    }
  };
});
