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
            ServerRequest(Constants.ServerRequests.CAN_IMPORT_HTML, {
                data: { messageTemplateId: context.currentContext.messageTemplateId, managerRootId: context.currentContext.managerRootId, messageName: context.currentContext.messageName },
                success: function(response) {
                    if (response.error) {
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        return;
                    }

                    if (!response.value) {
                        var messagetoAdd = { id: "canNotImportNewHtmlLayout", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.ImportHtmlLayout.CanNotImport"), actions: [], closable: false };
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