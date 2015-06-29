define(["sitecore"], function (Sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      Sitecore.ExperienceEditor.Dialogs.prompt(Sitecore.ExperienceEditor.TranslationsUtils.translateText(Sitecore.ExperienceEditor.TranslationsUtils.keys.Enter_a_new_name_for_the_item), context.currentContext.value, function (newDisplayName) {
        if (newDisplayName == null) {
          context.aborted = true;
          return;
        }

        context.currentContext.value = newDisplayName;
        Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ChangeDisplayName", function (response) {
          response.context.app.refreshOnItem(response.context.currentContext);
        }).execute(context);
      });
    }
  };
});