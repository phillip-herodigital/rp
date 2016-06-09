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
        execute: function(context, callback) {
            ServerRequest(Constants.ServerRequests.ADD_MESSAGE_VARIANT, {
                data: { messageId: context.currentContext.messageId, language: context.currentContext.language },
                success: function(response) {
                    if (response.error) {
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                    } else {
                        context.currentContext.newVariant = response.newVariant;
                        callback(response.newVariant);
                    }
                    context.app.MessageContext.set("isBusy", false);
                },
                async: false
            });
        }
    };
});