define(["sitecore"], function (Sitecore) {
    Sitecore.Commands.AddComponent =
    {
        canExecute: function (context, parent) {
            if (!Sitecore.ExperienceEditor.isInMode("edit")) {
                if (parent.initiator.componentName == 'QuickbarButton') {
                    parent.initiator.set({ isVisible: false });
                } else {
                    parent.initiator.set({ isEnabled: false });
                }

                return false;
            }

            return context.app.canExecute("ExperienceEditor.CanAddComponent", context.currentContext);
        },

        execute: function (context) {
            Sitecore.ExperienceEditor.PageEditorProxy.showRenderingTargets();
        }
    };
});