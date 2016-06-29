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
        priority: 4,
        execute: function(context) {
            ServerRequest(Constants.ServerRequests.MESSAGE_URL, {
                data: { value: context.data.messageId },
                success: function(response) {
                    if (response.error || !response.value) {
                        var errorMessage = response.errorMessage || sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.CanNotOpenNewMessage");
                        DialogService.show('alert', { text: errorMessage });
                        context.aborted = true;
                        return;
                    }

                    if (response.error) {
                        return;
                    }

                    window.parent.location.replace(response.value);
                },
                async: false
            });
        }
    };
});