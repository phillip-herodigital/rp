define(["sitecore"], function (_sc) {
    
    _sc.Commands.CreatePageMatcher =
    {
        canExecute: function (context) {
            return true;
        },
        execute: function (context) {

            var itemId = _sc.Helpers.url.getQueryParameters(window.parent.location.href)["sc_itemid"] || '';
            var selectedUrl = _sc.Helpers.url.getQueryParameters(window.parent.location.href)["url"] || '';

            var dialogPath = "/sitecore/client/Applications/FXM/ExperienceEditorExtension/Dialogs/CreatePageMatcher?itemId=" + itemId + "&url=" + selectedUrl;
            var dialogFeatures = "dialogHeight:650;dialogWidth:700;ignoreSpeakSizes:true";

            _sc.ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function (result) {
                if (result) {
                    window.top.location.reload();
                }
            });
        }
    };
});