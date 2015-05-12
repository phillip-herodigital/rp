define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateRequestProcessor("ExperienceEditor.Delete.ExecuteRequest", function (response) {
        response.context.currentContext.itemId = response.responseValue.value;
        response.context.app.refreshOnItem(response.context.currentContext);
    });
});