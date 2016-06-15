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
        execute: function(context) {
            if (!context.confirmed) {
                context.aborted = true;
                return;
            }

            var itemIds = [];
            for (var i = 0; i < context.recipientLists.length; i++) {
                itemIds[i] = context.recipientLists[i].itemId;
            }

            ServerRequest(Constants.ServerRequests.REMOVE_UNSUBSCRIBED_CONTACTS, {
                data: { recipientListIds: itemIds, messageId: context.messageId },
                success: function(response) {
                    if (response.error) {
                        DialogService.show('alert', { text: response.errorMessage });
                        context.aborted = true;
                        return;
                    }

                    context.response = response.results;
                },
                async: false
            });
        }
    };
});