define(["sitecore", "/-/speak/v1/ExperienceEditor/SetDeviceSimulator.js"], function (Sitecore) {
  Sitecore.Commands.ShowDeviceSimulators =
  {
    canExecute: function (context) {
      return Sitecore.ExperienceEditor.isInMode("preview");
    },

    execute: function (context) {
    }
  };
});
