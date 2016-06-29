define([
    "sitecore",
    "/-/speak/v1/ecm/ServerRequest.js",
    "/-/speak/v1/ecm/constants.js"
], function(
    _sc,
    ServerRequest,
    Constants
) {
    return {
        priority: 3,
        execute: function(context) {
            context.currentContext.messageBar.removeMessage(function(error) { return error.id === "error.ecm.sendquicktest.execute"; });
            ServerRequest(Constants.ServerRequests.EXECUTE_SEND_QUICK_TEST, {
                data: {
                    messageId: context.currentContext.messageId,
                    language: context.currentContext.language,
                    variantIds: context.currentContext.variantIds,
                    testEmails: context.currentContext.testEmails
                },
                success: function(response) {
                    if (response.error) {
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        return;
                    }

                    context.currentContext.messageBar.addMessage("notification", { text: response.value, actions: [], closable: true });
                    context.response = response;
                },
                async: false
            });
        }
    };
});