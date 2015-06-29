define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.DisplayName.GetCurrentDisplayName", function(response) {
        response.context.currentContext.value = response.responseValue.value;
    });
});