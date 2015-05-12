﻿define(["sitecore"], function (Sitecore) {
    Sitecore.Commands.ManageFunctions =
    {
        canExecute: function (context) {
            return true;
        },
        execute: function (context) {

            var itemId = Sitecore.Helpers.url.getQueryParameters(window.parent.location.href)["sc_itemid"] || '';

            var dialogPath = "/sitecore/client/Applications/FXM/ExperienceEditorExtension/Dialogs/ManageFunctions?sc_itemId=" + itemId;
            var dialogFeatures = "dialogHeight:450;dialogWidth:700;ignoreSpeakSizes:true";

            Sitecore.ExperienceEditor.Dialogs.showModalDialog(dialogPath, '', dialogFeatures, null, function(result) {
                if (result) {
                    window.top.location.reload();
                }
            });
        }
    };
});