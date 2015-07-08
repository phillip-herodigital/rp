define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateDialogCallProcessor({
        url: function (context) { return "/sitecore/shell/default.aspx?" + context.currentContext.value; },
        features: "dialogHeight: 600px;dialogWidth: 500px;",
        onSuccess: function (context, preset) {
            context.currentContext.value = preset;
        }
    });
});