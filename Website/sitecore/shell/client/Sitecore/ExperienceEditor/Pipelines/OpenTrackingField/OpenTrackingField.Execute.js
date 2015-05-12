define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.OpenTrackingField.Execute", function (response) {
        window.top.location.reload();
    });
});