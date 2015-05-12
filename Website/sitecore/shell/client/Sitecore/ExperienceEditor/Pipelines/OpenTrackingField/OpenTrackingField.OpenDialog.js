define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateDialogCallProcessor({
        url: function (context) { return context.currentContext.value; },
        features: "dialogHeight: 600px;dialogWidth: 500px;",
        onSuccess: function (context, trackingField) {
            context.currentContext.value = Sitecore.ExperienceEditor.Web.encodeHtml(trackingField);
        }
    });
});