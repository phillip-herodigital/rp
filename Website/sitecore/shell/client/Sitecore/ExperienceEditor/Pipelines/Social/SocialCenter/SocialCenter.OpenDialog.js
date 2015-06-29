define(["sitecore"], function (Sitecore) {
  return {
    execute: function (context) {
      context.suspend();

      Sitecore.ExperienceEditor.Dialogs.showModalDialog(context.currentContext.value, '', 'dialogHeight: 800px;dialogWidth: 1200px;', null, function (result) {
        context.resume();
      });
    }
  };
});