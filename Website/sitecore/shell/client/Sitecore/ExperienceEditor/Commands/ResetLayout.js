define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.ResetLayout =
  {
    canExecute: function (context, parent) {
      var isEnabled = false;
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ResetLayout.IsEnabled", function (response) {
        isEnabled = response.responseValue.value;
        if (parent) {
          parent.initiator.set({ isEnabled: isEnabled });
        }
      }).execute(context);

      return isEnabled;
    },
    execute: function (context) {
      var dialogPath = "/sitecore/shell/default.aspx?xmlcontrol=ResetLayout";
      var dialogFeatures = "dialogHeight: 267px;dialogWidth: 370px;";
      Sitecore.ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function(result) {
        if (!result || result == "undefined") {
          return;
        }

        context.currentContext.value = encodeURIComponent(result);
        Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ResetLayout.Execute", function () {
          window.top.location.reload();
        }).execute(context);
      });
    }
  };
});