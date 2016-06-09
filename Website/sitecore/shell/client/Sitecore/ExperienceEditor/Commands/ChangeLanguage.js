define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  Sitecore.Commands.ChangeLanguage =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      context.currentContext.value = encodeURIComponent(context.currentContext.argument) + "|" + context.currentContext.ribbonUrl;
      ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Language.ChangeLanguage", function (response) {
        var removeVersionUrl = ExperienceEditor.Web.removeQueryStringParameter(response.responseValue.value, "sc_version");
        window.parent.location = removeVersionUrl;
      }).execute(context);
    }
  };
});