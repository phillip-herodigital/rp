define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Rename.GetCurrentName", function (response) {
        response.context.currentContext.itemName = response.responseValue.value;
    });
});