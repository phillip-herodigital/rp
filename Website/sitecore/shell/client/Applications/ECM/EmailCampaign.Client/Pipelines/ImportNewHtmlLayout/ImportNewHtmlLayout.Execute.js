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
            ServerRequest(Constants.ServerRequests.IMPORT_HTML, {
                data: { fileItemId: context.currentContext.fileItemId, fileName: context.currentContext.fileName, database: context.currentContext.database },
                success: function(response) {
                    if (response.error) {
                        context.currentContext.errorCount = 1;
                        context.aborted = true;
                        return;
                    }

                    if (!response.value) {
                        var messagetoAdd = { id: "importHtmlLayoutFailed", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.ImportHtmlLayout.ImportFailed"), actions: [], closable: false };
                        sitecore.trigger('ajax:error', messagetoAdd);
                        context.aborted = true;
                        context.currentContext.errorCount = 1;
                        return;
                    } else {
                        context.currentContext.layoutId = response.value;
                    }
                },
                async: false
            });
        }
    };
});