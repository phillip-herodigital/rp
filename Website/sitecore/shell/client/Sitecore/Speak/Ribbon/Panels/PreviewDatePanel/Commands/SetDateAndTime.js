define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.SetDateAndTime =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.PreviewDate.GetPreviewDateUrl", function (response) {
        Sitecore.ExperienceEditor.Dialogs.showModalDialog(response.responseValue.value, '', '', null, function (result) {
          if (!result) {
            return;
          }

          context.currentContext.value = result;
          Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.PreviewDate.SetDateValue", function () {
            Sitecore.ExperienceEditor.modifiedHandling(null, function(isOk) {
              window.top.location.reload();
            });
          }).execute(context);
        });
      }).execute(context);
    }
  };
});