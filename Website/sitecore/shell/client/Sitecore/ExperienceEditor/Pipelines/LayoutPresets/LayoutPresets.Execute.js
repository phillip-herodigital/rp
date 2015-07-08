define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.LayoutPresets.Execute", function (response) {
        window.top.location = response.responseValue.value;
    });
});