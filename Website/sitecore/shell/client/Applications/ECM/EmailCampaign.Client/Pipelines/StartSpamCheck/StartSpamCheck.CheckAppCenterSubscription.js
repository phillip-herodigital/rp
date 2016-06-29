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
        priority: 1,
        execute: function(context) {
            ServerRequest(Constants.ServerRequests.IS_SPAM_CHECK_SERVICE_PURCHASED, {
                data: {},
                success: function(response) {
                    if (response.error) {
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        MessageReviewHelper.setSpamCheckCheckButtonViewLogic(context.app, false);
                        return;
                    }
                },
                async: false
            });
        }
    };
});