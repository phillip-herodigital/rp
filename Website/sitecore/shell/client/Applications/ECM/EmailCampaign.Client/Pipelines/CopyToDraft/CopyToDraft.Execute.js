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
        priority: 3,
        execute: function(context) {
            if (!context.confirmed) {
                context.aborted = true;
                return;
            }

            ServerRequest(Constants.ServerRequests.COPY_TO_DRAFT, {
                data: { sourceMessageId: context.data.messageId, messageName: _.escape(context.data.messageName) },
                success: function(response) {
                    if (response.error) {
                        DialogService.show('alert', { text: response.errorMessage });
                        context.aborted = true;
                        return;
                    }

                    context.data.messageId = response.value;
                },
                async: false
            });

        }
    };
});