define(["sitecore"], function (Sitecore) {
  Sitecore.Commands.Close =
  {
    canExecute: function (context) {
      return true;
    },
    execute: function (context) {
      var stringContext = { value: encodeURIComponent(window.parent.location.href) };
      Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Close", function (response) {
        window.parent.location.replace(response.responseValue.value + "&sc_debug=0&sc_trace=0&sc_prof=0&sc_ri=0&sc_rb=0&sc_expview=0");
      }, stringContext).execute(context);
    }
  };
});