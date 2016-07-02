define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.ChangeDay =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      console.log(context.button.get("direction"));
      context.currentContext.value = context.button.get("addDays");
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.PreviewDate.AddDays", function () {
        window.parent.location = window.parent.location;
      }).execute(context);
    }
  };
});