define(["sitecore"], function (Sitecore) {
  return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.LockItem", function (response) {
    if (response.context.currentContext.version != response.responseValue.value.Version) {
      response.context.app.refreshOnItem(response.context.currentContext);
    }

    Sitecore.Commands.Lock.setButtonTitle(Sitecore.ExperienceEditor.instance, response.responseValue.value.Locked);
  });
});