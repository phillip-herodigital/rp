define(["sitecore"], function (Sitecore) {
  return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.SaveDebugRequests.GetProfileName", function (response) {
    response.context.currentContext.value = response.responseValue.value;
  });
});