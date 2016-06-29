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
        priority: 1,
        execute: function(context) {
            ServerRequest(Constants.ServerRequests.CAN_DELETE_MESSAGE, {
                data: { value: context.currentContext.messageId },
                success: function(response) {
                    if (response.error || !response.value) {
                        var errorMessage = response.errorMessage || sitecore.Resources.Dictionary.translate('ECM.Pipeline.DeleteMessage.CanNotDelete');

                        DialogService.show('alert', { text: errorMessage });
                        context.aborted = true;
                    }
                },
                async: false
            });
        }
    };
});