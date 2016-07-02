define(["sitecore"], function (Sitecore) {
    return Sitecore.ExperienceEditor.PipelinesUtil.generateDialogCallProcessor({
        url: function (context) { return "/sitecore/shell/Applications/Dialogs/Move to.aspx?fo=" + context.currentContext.itemId + "& sc_content=" + context.currentContext.database; },
        features: "dialogHeight: 700px;dialogWidth: 800px;",
        onSuccess: function (context, targetItemId) {
            context.currentContext.targetItemId = targetItemId;
        }
    });
});