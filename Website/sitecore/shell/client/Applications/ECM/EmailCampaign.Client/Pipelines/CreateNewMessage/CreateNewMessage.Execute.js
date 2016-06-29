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
            ServerRequest(Constants.ServerRequests.CREATE_NEW_MESSAGE, {
                data: { messageTemplateId: context.currentContext.messageTemplateId, managerRootId: context.currentContext.managerRootId, messageName: context.currentContext.messageName, language: context.currentContext.language, messageTypeTemplateId: context.currentContext.messageTypeTemplateId, LayoutId: context.currentContext.layoutId },
                success: function(response) {
                    if (response.error) {
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        return;
                    }

                    if (!response.value) {
                        var messagetoAdd = { id: "createMessageFailed", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.CreateMessage.CreateFailed"), actions: [], closable: false };
                        sitecore.trigger('ajax:error', messagetoAdd);
                        context.aborted = true;
                        context.currentContext.errorCount = 1;
                        return;
                    } else {
                        context.currentContext.newMessageId = response.value;
                    }
                },
                async: false
            });
        }
    };
});