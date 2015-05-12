define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateDialogCallProcessor({
        url: function (context) { return context.currentContext.value; },
        features: "dialogHeight: 700px;dialogWidth: 1300px;",
        onSuccess: function (context, itemId) {
            context.currentContext.value = itemId;
        }
    });
});