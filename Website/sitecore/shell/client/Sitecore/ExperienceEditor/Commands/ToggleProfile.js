define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.ToggleProfile =
  {
    canExecute: function (context) {
      var pressed = Sitecore.ExperienceEditor.isDebugging() && Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_prof") == "1";
      context.button.set({ isPressed: pressed });
      return Sitecore.ExperienceEditor.canToggleDebug();
    },
    execute: function (context) {
      context.currentContext.value = encodeURIComponent(window.parent.location);
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleDebugRequests.ExecuteToggleProfile", function (response) {
        window.parent.location = response.responseValue.value;
      }).execute(context);
    }
  };
});