define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  return ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.LockItem", function (response) {
    if (response.context.currentContext.version != response.responseValue.value.Version) {
      response.context.app.refreshOnItem(response.context.currentContext);
    }

    Sitecore.Commands.Lock.setButtonTitle(ExperienceEditor.getContext(), response.responseValue.value.Locked);
  });
});