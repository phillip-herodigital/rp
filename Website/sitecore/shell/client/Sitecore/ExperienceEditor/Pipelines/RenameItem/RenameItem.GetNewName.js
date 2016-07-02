define(["sitecore"], function (Sitecore) {
  return {
    priority: 4,
    execute: function (context) {
      context.suspend();
      Sitecore.ExperienceEditor.Dialogs.prompt(Sitecore.ExperienceEditor.TranslationsUtils.translateText(Sitecore.ExperienceEditor.TranslationsUtils.keys.Enter_a_new_name_for_the_item), context.currentContext.itemName.trim(), function (newName) {
        if (newName == null) {
          context.aborted = true;
          return;
        }

        context.currentContext.value = newName;
        context.resume();
        Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Rename.ValidateNewName").execute(context);
      });
    }
  };
});