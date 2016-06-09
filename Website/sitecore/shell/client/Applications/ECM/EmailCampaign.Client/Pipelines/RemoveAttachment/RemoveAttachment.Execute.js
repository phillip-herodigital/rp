define([
    "sitecore",
    "/-/speak/v1/ecm/ServerRequest.js",
    "/-/speak/v1/ecm/constants.js"
], function(
    sitecore,
    ServerRequest,
    Constants
) {
    return {
        priority: 1,
        execute: function(context) {
            ServerRequest(Constants.ServerRequests.REMOVE_ATTACHMENT, {
                data: { messageId: context.currentContext.messageId, attachmentIds: context.currentContext.attachmentIds, language: context.currentContext.language },
                success: function(response) {
                    if (response.error) {
                        context.aborted = true;
                        return;
                    }
                },
                async: false
            });
        }
    };
});