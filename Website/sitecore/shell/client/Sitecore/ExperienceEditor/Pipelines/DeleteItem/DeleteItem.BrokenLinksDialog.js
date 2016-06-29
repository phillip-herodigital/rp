define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.js"], function (Sitecore, ExperienceEditor) {
  return {
    priority: 1,
    execute: function (context) {
      var generateDialogCallProcessor = ExperienceEditor.PipelinesUtil.generateDialogCallProcessor({
        url: function (context) { return "/sitecore/shell/default.aspx?xmlcontrol=BreakingLinks&list=" + context.currentContext.itemId + "&ignoreclones=1"; },
        onSuccess: function (context, dialogResponse) {
          context.aborted = dialogResponse == "no";
        }
      });

      if (context.currentContext.value) {
        generateDialogCallProcessor.execute(context);
      }
    }
  }
});