define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.LayoutPresets.GetDialogUrl", function (response) {
        response.context.currentContext.value = response.responseValue.value;
    });
});