define([
    "sitecore",
    "/-/speak/v1/ecm/ServerRequest.js",
    "/-/speak/v1/ecm/MessageReviewHelper.js",
    "/-/speak/v1/ecm/constants.js"
], function(
    _sc,
    ServerRequest,
    MessageReviewHelper,
    Constants
) {
    return {
        priority: 3,
        execute: function(context) {
            ServerRequest(Constants.ServerRequests.EXECUTE_SPAM_CHECK, {
                data: {
                    messageId: context.currentContext.messageId,
                    language: context.currentContext.language,
                    clients: context.currentContext.clientIds,
                    variants: context.currentContext.variantIds
                },
                success: function(response) {
                    if (response.error) {
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        MessageReviewHelper.setSpamCheckCheckButtonViewLogic(context.app, false);
                        return;
                    }

                    context.response = response;
                },
                async: false
            });
        }
    };
});