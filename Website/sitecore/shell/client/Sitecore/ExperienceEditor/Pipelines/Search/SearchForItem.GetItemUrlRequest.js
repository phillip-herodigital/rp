define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Search.GetItemUrlRequest", function (response) {
        if (!response.responseValue.value) {
            return;
        }

        window.top.location = response.responseValue.value;
    });
});