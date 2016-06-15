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
        priority: 20,

        execute: function(context) {
            if (!context.confirmed) {
                context.aborted = true;
                return;
            }
            ServerRequest(Constants.ServerRequests.REMOVE_BOUNCED_CONTACTS, {
                data: { recipientListId: context.recipientList.itemId, messageId: context.messageId },
                success: function(response) {
                    if (response.error) {
                        DialogService.show('alert', { text: response.errorMessage });
                        context.aborted = true;
                        return;
                    }

                    context.response = response.value;
                },
                async: false
            });
        }
    };
});