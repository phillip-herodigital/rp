define([
    "sitecore",
    "/-/speak/v1/ecm/ServerRequest.js",
    "/-/speak/v1/ecm/constants.js"
], function(sitecore, ServerRequest, Constants) {
    return {
        priority: 3,
        execute: function(context) {
            ServerRequest(Constants.ServerRequests.SWITCH_LANGUAGE, {
                data: { messageId: context.currentContext.messageId, language: context.currentContext.language },
                success: function(response) {
                    if (response.error) {
                        context.aborted = true;
                        return;
                    }

                    if (response.created) {
                        context.currentContext.languageSwitched = true;
                    }
                },
                async: false
            });
        }
    };
});