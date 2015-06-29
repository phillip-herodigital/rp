define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js"
], function (_sc, _legacy, $sc) {
    var pagePath = "/sitecore/client/Applications/FXM/ExperienceEditorExtension/Dialogs/CreateClientAction";
    _sc.Commands.CreateClientAction =
    {
        canExecute: function (context) {
            // TODO: validate is allowed
            return true; 
        },
        execute: function (context) {

            // context should have callback

            var data = {
                selector: context.selector
            }

            var dialogPath = _sc.Helpers.url.addQueryParameters(pagePath, data);
            var dialogFeatures = "dialogHeight:500;dialogWidth:700;ignoreSpeakSizes:true";

            _sc.ExperienceEditor.Dialogs.showModalDialog(dialogPath, null, dialogFeatures, null, function (data) {
                if (context.callback) {
                    context.callback(data);

                    if (data != null) {
                        _legacy.PageModes.PageEditor.setModified(true);
                        _sc.ExperienceEditor.isModified = true;

                        var message = _sc.ExperienceEditor.instance.TranslationDictionary.translate("The FXM function you have placed on this page has been saved.");
                        var actionMessage = "";
                        var actionClick = "";

                        _sc.ExperienceEditor.instance.NotificationBar.addMessage("notification", {
                            text: message,
                            closable: false,
                            actions: [{
                                text: actionMessage,
                                action: actionClick
                            }]
                        });

                        _sc.ExperienceEditor.instance.setHeight();
                    }
                }
            });
        }
    };
});