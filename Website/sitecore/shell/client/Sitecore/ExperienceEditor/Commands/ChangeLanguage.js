define(["sitecore"], function(Sitecore) {
    Sitecore.Commands.ChangeLanguage =
    {
        canExecute: function(context) {
            return true;
        },
        execute: function(context) {
          context.currentContext.value = encodeURIComponent(context.currentContext.argument) + "|" + context.currentContext.ribbonUrl;
          Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Language.ChangeLanguage", function (response) {
            window.parent.location = response.responseValue.value;
          }).execute(context);
        }
    };
});