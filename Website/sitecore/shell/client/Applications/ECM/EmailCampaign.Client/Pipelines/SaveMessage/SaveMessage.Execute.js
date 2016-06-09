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
            ServerRequest(Constants.ServerRequests.SAVE_MESSAGE, {
                data: { message: context.currentContext.message, language: context.currentContext.language },
                success: function(response) {
                    context.currentContext.refreshMessageContext = response.refreshMessageContext;
                    if (response.error) {
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        return;
                    }
                    context.currentContext.saved = true;
                },
                async: false
            });
        }
    };
});