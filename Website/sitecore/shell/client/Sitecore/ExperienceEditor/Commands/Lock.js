define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.Lock =
  {
    button: null,
    canExecute: function (context) {
      var result = Sitecore.ExperienceEditor.isInMode("edit") && context.app.canExecute("ExperienceEditor.LockItem.CanToggleLock", context.currentContext);
      this.setButtonTitle(context, context.currentContext.isLocked);

      return result;
    },

    execute: function (context) {
      context.app.disableButtonClickEvents();
      Sitecore.ExperienceEditor.PipelinesUtil.executePipeline(context.app.LockItemPipeline, function () {
        Sitecore.ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.LockItem, context);
        if (Sitecore.Commands.MyItems
          && Sitecore.Commands.MyItems.canExecute) {
          Sitecore.Commands.MyItems.canExecute(context);
        }
      });

      context.app.enableButtonClickEvents();
    },

    setButtonTitle: function(context, isLocked) {
      if (!Sitecore.Commands.Lock.button) {
        Sitecore.Commands.Lock.button = context.button;
      }

      var lockButton = Sitecore.Commands.Lock.button;
      lockButton.viewModel.setTitle(Sitecore.ExperienceEditor.TranslationsUtils.translateText(isLocked ?
        Sitecore.ExperienceEditor.TranslationsUtils.keys.Unlock :
        Sitecore.ExperienceEditor.TranslationsUtils.keys.Lock));
    }
  };
});