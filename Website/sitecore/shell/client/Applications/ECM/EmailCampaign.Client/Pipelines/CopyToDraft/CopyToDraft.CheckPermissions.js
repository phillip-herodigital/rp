define([
    "sitecore",
    "/-/speak/v1/ecm/ServerRequest.js",
    "/-/speak/v1/ecm/DialogService.js",
    "/-/speak/v1/ecm/constants.js"
], function(
    sitecore,
    ServerRequest,
    DialogService,
    Constants) {
    return {
        priority: 1,
        execute: function(context) {
            ServerRequest(Constants.ServerRequests.CHECK_PERMISSIONS, {
                data: { value: context.data.messageId },
                success: function(response) {
                    if (response.error || !response.value) {
                        var errorMessage = response.errorMessage || sitecore.Resources.Dictionary.translate("ECM.Pipeline.CopyToDraft.DoNotHavePermissions");
                        DialogService.show('alert', { text: errorMessage });
                        context.aborted = true;
                        return;
                    }
                },
                async: false
            });
        }
    };
});