define([
    "sitecore",
    "/-/speak/v1/ecm/ServerRequest.js",
    "/-/speak/v1/ecm/DialogService.js",
    "/-/speak/v1/ecm/constants.js"
], function(
    sitecore,
    ServerRequest,
    DialogService,
    Constants
) {
    return {
        priority: 2,
        execute: function(context) {
            ServerRequest(Constants.ServerRequests.DELETE_FOLDER, {
                data: { value: context.currentContext.folderId },
                success: function(response) {
                    if (response.error || !response.value) {
                        var errorMessage = response.errorMessage || sitecore.Resources.Dictionary.translate("ECM.Pipeline.DeleteFolder.DeleteFailed");

                        DialogService.show('alert', { text: errorMessage });
                        context.aborted = true;
                    }
                },
                async: false
            });
        }
    };
});