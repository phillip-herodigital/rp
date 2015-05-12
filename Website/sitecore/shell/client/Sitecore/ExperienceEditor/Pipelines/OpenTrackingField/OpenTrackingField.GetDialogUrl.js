define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.OpenTrackingField.GetDialogUrl", function (response) {
        response.context.currentContext.value = response.responseValue.value;
    });
});