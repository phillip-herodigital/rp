define(["sitecore"], function (Sitecore) {
  return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Delete.CheckLinks", function (response) {
    response.context.currentContext.value = response.responseValue.value;
  });
});