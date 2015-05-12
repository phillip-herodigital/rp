define(["sitecore"], function(Sitecore) {
    Sitecore.Commands.WorkBox =
    {
        canExecute: function(context) {
            return true;
        },
        execute: function (context) {
          var workboxDialogTitle = context.app.canExecute("ExperienceEditor.Workbox.GetDialogTitle", context.currentContext);
          var dialogPath = "/sitecore/shell/Applications/Workbox/default.aspx?fo=" + context.currentContext.itemId + "&la=" + context.currentContext.language + "&vs=" + context.currentContext.version + "&pa=2&mo=preview";
          var dialogFeatures = "dialogHeight:700px;dialogWidth:1200px;header:" + workboxDialogTitle + ";";
          Sitecore.ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures);
        }
    };
});