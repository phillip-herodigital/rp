define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.LayoutDetails =
  {
    canExecute: function (context, parent) {
      var isEnabled = false;
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.LayoutDetails.CanEdit", function (response) {
        isEnabled = response.responseValue.value;
        if (parent) {
          parent.initiator.set({ isEnabled: isEnabled });
        }
      }).execute(context);

      return isEnabled;
    },
    execute: function (context) {
      var dialogPath = "/sitecore/shell/default.aspx?xmlcontrol=LayoutDetails&id=" + context.currentContext.itemId + "&la=" + context.currentContext.language + "&vs=" + context.currentContext.version;
      var dialogFeatures = "dialogHeight: 600px;dialogWidth: 500px;";
      Sitecore.ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function(result) {
        if (!result) {
          return;
        }

        context.currentContext.value = Sitecore.ExperienceEditor.Web.encodeHtml(result);

        Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.LayoutDetails.SetValue", function () {
          window.top.location.reload();
        }).execute(context);
      });
    }
  };
});