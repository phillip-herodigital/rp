define(
  [
    "sitecore",
    "/-/speak/v1/ExperienceEditor/ExperienceEditor.js",
    "/-/speak/v1/ExperienceEditor/TranslationUtil.js"
  ],
  function (Sitecore, ExperienceEditor, TranslationUtil) {
  Sitecore.Commands.Lock =
  {
    button: null,
    canExecute: function (context) {
      var result = ExperienceEditor.isInMode("edit") && context.app.canExecute("ExperienceEditor.LockItem.CanToggleLock", context.currentContext);
      this.setButtonTitle(context, context.currentContext.isLocked);

      return result;
    },

    execute: function (context) {
      context.app.disableButtonClickEvents();
      ExperienceEditor.PipelinesUtil.executePipeline(context.app.LockItemPipeline, function () {
        ExperienceEditor.PipelinesUtil.executeProcessors(Sitecore.Pipelines.LockItem, context);
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
      lockButton.viewModel.setTitle(TranslationUtil.translateText(isLocked ? TranslationUtil.keys.Unlock : TranslationUtil.keys.Lock));
    }
  };
});