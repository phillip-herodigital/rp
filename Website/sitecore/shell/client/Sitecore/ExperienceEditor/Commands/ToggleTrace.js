define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.ToggleTrace =
  {
    canExecute: function (context) {
      var pressed = Sitecore.ExperienceEditor.isDebugging() && Sitecore.ExperienceEditor.Web.getUrlQueryStringValue("sc_trace") == "1";
      context.button.set({ isPressed: pressed });
      return Sitecore.ExperienceEditor.canToggleDebug();
    },
    execute: function (context) {
      context.currentContext.value = encodeURIComponent(window.parent.location);
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.ToggleDebugRequests.ExecuteToggleTrace", function (response) {
        window.parent.location = response.responseValue.value;
      }).execute(context);
    }
  };
});