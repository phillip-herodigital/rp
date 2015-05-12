define(["sitecore"], function (Sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      context.commands = new Array();
      jQuery.each(context.app, function () {
        if (this.attributes === undefined || this.attributes.command === undefined || this.componentName === undefined || this.componentName === "Command") {
          return;
        }

        context.commands.push(getCommand(this));

        function getCommand(commandInitiator) {
          return {
            initiator: commandInitiator,
            command: Sitecore.Commands[commandInitiator.attributes.command]
          };
        }
      });
    }
  };
});