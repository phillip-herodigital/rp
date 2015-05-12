define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Logout", function (response) {
        window.parent.location.replace(response.responseValue.value);
    }, { value: encodeURIComponent(window.parent.location.href) });
});