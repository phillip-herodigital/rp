define([
    "sitecore",
    "/-/speak/v1/ecm/ServerRequest.js",
    "/-/speak/v1/ecm/constants.js"
], function(sitecore, ServerRequest, Constants) {
    return {
        priority: 4,
        execute: function(context) {
            ServerRequest(Constants.ServerRequests.ADD_PRE_EXISTING_PAGE, {
                data: { databaseName: context.currentContext.databaseName, newMessageId: context.currentContext.newMessageId, existingMessagePath: context.currentContext.existingMessagePath },
                success: function(response) {
                    if (response.error) {
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        return;
                    }

                    if (!response.value) {
                        var messagetoAdd = { id: "addPreExistingPageFailed", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.AddExistingPage.AddFailed"), actions: [], closable: false };
                        sitecore.trigger('ajax:error', messagetoAdd);
                        context.aborted = true;
                        context.currentContext.errorCount = 1;
                        return;
                    }
                },
                async: false
            });
        }
    };
});