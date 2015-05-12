define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.DownloadProfile =
  {
    canExecute: function (context) {
      var isProfiling = Sitecore.ExperienceEditor.isDebugging() && Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_prof") == "1";
      return Sitecore.ExperienceEditor.canToggleDebug() && isProfiling;
    },
    execute: function (context) {
      context.currentContext.value = Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_prf");
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.DownloadDebugRequests.ExecuteDownloadProfile", function (response) {
        Sitecore.ExperienceEditor.Web.downloadFile(response.responseValue.value);
      }).execute(context);
    }
  };
});