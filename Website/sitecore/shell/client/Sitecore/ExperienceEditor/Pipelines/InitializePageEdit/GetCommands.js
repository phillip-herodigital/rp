define(["sitecore", "/-/speak/v1/ExperienceEditor/ExperienceEditor.Context.js"], function (Sitecore, ExperienceEditorContext) {
  return {
    priority: 1,
    execute: function (context) {
      context.commands = new Array();
      jQuery.each(context.app, function () {
        if (this.get === undefined
          || this.get("command") === undefined
          || this.componentName === undefined
          || this.componentName === "Command"
          || this.componentName === "CommandDependency") {
          return;
        }

        context.commands.push(getCommand(this));

        function getCommand(commandInitiator) {
          var postponedValue = commandInitiator.viewModel.$el.attr("data-sc-postponedCall");
          var isPostponed = postponedValue === "0" || postponedValue === "False";
          return {
            initiator: commandInitiator,
            command: Sitecore.Commands[commandInitiator.get("command")],
            stripId: isPostponed ? null : getStripId(jQuery(commandInitiator.viewModel.$el[0])),
            evaluated : false
          };
        }

        function getStripId(commandInitiator) {
          if (commandInitiator.length == 0) {
            return null;
          }

          if (commandInitiator.hasClass("sc-strip")) {
            return commandInitiator.attr("data-sc-id");
          }

          return getStripId(commandInitiator.parent());
        }
      });

      ExperienceEditorContext.instance.cachedCommands = context.commands;
    }
  };
});