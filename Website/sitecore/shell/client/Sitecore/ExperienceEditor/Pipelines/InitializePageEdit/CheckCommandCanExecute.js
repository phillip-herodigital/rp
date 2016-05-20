define(["sitecore"], function (Sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      $.each(context.commands, function () {
        if (this.command === undefined) {
          var controlStateResult = this.initiator.viewModel.$el.attr("data-sc-controlstateresult");
          if (controlStateResult && controlStateResult != "") {
            this.initiator.set({ isEnabled: controlStateResult == "True" });
          }
          return;
        }

        context.button = this.initiator;
        this.initiator.set({ isEnabled: this.command.canExecute(context, this) });
      });
    }
  };
});