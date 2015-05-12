define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Rename.RepairLinks", function (response) {
        response.context.app.refreshOnItem(response.context.currentContext);
    });
});