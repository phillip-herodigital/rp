define(["sitecore"], function (Sitecore) {
  return {
    priority: 3,
    execute: function (context) {
      context.suspend();
      Sitecore.ExperienceEditor.Dialogs.prompt(Sitecore.ExperienceEditor.TranslationsUtils.translateText(Sitecore.ExperienceEditor.TranslationsUtils.keys.Enter_the_filename_where_to_save_the_trace), context.currentContext.value, function (newName) {
        if (newName == null) {
          context.aborted = true;
          return;
        }

        context.currentContext.value = Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_trf") + "|" + newName;
        context.resume();
      });
    }
  };
});