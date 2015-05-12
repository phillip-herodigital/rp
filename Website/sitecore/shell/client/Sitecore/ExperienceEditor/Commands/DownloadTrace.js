define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.DownloadTrace =
  {
    canExecute: function (context) {
      var isTracing = Sitecore.ExperienceEditor.isDebugging() && Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_trace") == "1";
      return Sitecore.ExperienceEditor.canToggleDebug() && isTracing;
    },
    execute: function (context) {
      context.currentContext.value = Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_trf");
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.DownloadDebugRequests.ExecuteDownloadTrace", function (response) {
        Sitecore.ExperienceEditor.Web.downloadFile(response.responseValue.value);
      }).execute(context);
    }
  };
});