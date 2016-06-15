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
        priority: 2,
        execute: function(context) {
            ServerRequest(Constants.ServerRequests.CAN_CREATE_NEW_MESSAGE, {
                data: { managerRootId: context.currentContext.managerRootId },
                success: function(response) {
                    if (response.error) {
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        return;
                    }

                    if (!response.value) {
                        var messagetoAdd = { id: "canNotCreateNewMessage", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.CanNotCreate"), actions: [], closable: false };
                        sitecore.trigger('ajax:error', messagetoAdd);
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