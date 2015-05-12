define(["sitecore"], function (Sitecore) {
    Sitecore.Commands.SetDeviceSimulator =
    {
        canExecute: function (context) {
            return Sitecore.ExperienceEditor.isInMode("preview");
        },

        execute: function (context) {
            var deviceSimulatorId = context.currentContext.argument;
            if (deviceSimulatorId === undefined | deviceSimulatorId.length <= 0) {
                return;
            }

            var simulatorCookie = "sc_simulator_id=" + deviceSimulatorId + "; path=/";
            window.document.cookie = simulatorCookie;
            window.parent.document.cookie = simulatorCookie;

            context.app.refreshOnItem(context.currentContext);
        }
    };
});
