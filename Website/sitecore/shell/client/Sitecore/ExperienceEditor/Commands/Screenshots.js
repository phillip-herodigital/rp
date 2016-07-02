define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.Screenshots =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.GetScreenShotUrl", function (response) {
        Sitecore.ExperienceEditor.Dialogs.showModalDialog(response.responseValue.value);
      }).execute(context);
    }
  };
});