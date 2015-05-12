define(["sitecore"], function(Sitecore) {
    return {
        priority: 1,
        execute: function(context) {
            $.each(context.commands, function() {
                if (this.command === undefined)
                    return;
                context.button = this.initiator;
                var enabled = this.command.canExecute(context, this);
                this.initiator.set({ isEnabled: enabled });
            });
        }
    };
});