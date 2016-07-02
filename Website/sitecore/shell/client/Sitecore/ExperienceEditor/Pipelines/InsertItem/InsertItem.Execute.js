define(["sitecore"], function (Sitecore) {
  return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Insert", function (response) {
    var itemId = response.responseValue.value.itemId;
    if (itemId == null || itemId.length <= 0) {
      Sitecore.ExperienceEditor.Dialogs.alert(Sitecore.ExperienceEditor.TranslationsUtils.translateText(Sitecore.ExperienceEditor.TranslationsUtils.keys.Could_not_create_item));
      response.context.aborted = true;
      return;
    }

    response.context.currentContext.itemId = itemId;
    response.context.app.refreshOnItem(response.context.currentContext);
  });
});