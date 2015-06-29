define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.SetAliases =
  {
    canExecute: function (context) {
      return context.app.canExecute("ExperienceEditor.SetAliases.CanSetAliases", context.currentContext);
    },

    execute: function (context) {
      var dialogFeatures = "dialogHeight: 615;dialogWidth: 500px;";
      var dialogUrl = "/sitecore/shell/default.aspx?xmlcontrol=Aliases";
      dialogUrl += "&id=" + context.currentContext.itemId;
      dialogUrl += "&la=" + context.currentContext.language;
      dialogUrl += "&vs=" + context.currentContext.version;

      Sitecore.ExperienceEditor.Dialogs.showModalDialog(dialogUrl, "", dialogFeatures, null);
    }
  };
});