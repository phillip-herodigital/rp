define(["sitecore"], function (Sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      context.commands = new Array();
      jQuery.each(context.app, function () {
        if (this.get === undefined || this.get("command") === undefined || this.componentName === undefined || this.componentName === "Command") {
          return;
        }

        context.commands.push(getCommand(this));

        function getCommand(commandInitiator) {
          return {
            initiator: commandInitiator,
            command: Sitecore.Commands[commandInitiator.get("command")]
          };
        }
      });
    }
  };
});