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
        priority: 5,
        execute: function(context) {
            ServerRequest(Constants.ServerRequests.MESSAGE_URL, {
                data: { value: context.currentContext.newMessageId },
                success: function(response) {
                    if (response.error) {
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        return;
                    }

                    if (!response.value) {
                        var messagetoAdd = { id: "canNotOpenNewMessage", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.CanNotOpenNewMessage"), actions: [], closable: false };
                        sitecore.trigger('ajax:error', messagetoAdd);
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        return;
                    }
                    window.parent.location.replace(response.value);
                },
                async: false
            });
        }
    };
});