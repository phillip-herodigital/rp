define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.ProfileCards =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ProfileCardsDialog.Url", function (response) {
        var dialogFeatures = "dialogHeight: 900px;dialogWidth: 900px;";
        Sitecore.ExperienceEditor.Dialogs.showModalDialog(response.responseValue.value, "", dialogFeatures, null, function (result) {
          window.setTimeout(function() {
            response.context.app.refreshOnItem(response.context.currentContext);
          }, 20);
        });
      }).execute(context);
    }
  };
});