define(["sitecore"], function (Sitecore) {
  return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor(
    "ExperienceEditor.Social.SocialCenter.GetDialogUrl",
    function (response) {
      response.context.currentContext.value = response.responseValue.value;
    });
});