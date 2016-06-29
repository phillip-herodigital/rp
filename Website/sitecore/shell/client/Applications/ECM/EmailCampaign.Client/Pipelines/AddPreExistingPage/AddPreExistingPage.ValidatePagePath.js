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
            ServerRequest(Constants.ServerRequests.VALIDATE_PAGE_PATH, {
                data: { databaseName: context.currentContext.databaseName, existingMessagePath: context.currentContext.existingMessagePath },
                success: function(response) {
                    if (response.error) {
                        if (context.onError) {
                            context.onError(response);
                        }
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        return;
                    }
                },
                async: false
            });
        }
    };
});