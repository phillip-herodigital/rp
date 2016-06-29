define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore, ServerRequest) {
  return {
    priority: 1,
    execute: function (params) {
      params.errorPopupResult = 0;
      var requestName = "EXM/SaveAsSubscriptionTemplate";
      var errorMessageId = "error." + requestName;
      ServerRequest(requestName, {
        data: { sourceMessageId: params.messageId, messageName: _.escape(params.messageName) },
        success: function (response) {
          params.messageBarMain.removeMessage(function (error) { return error.id === errorMessageId; });
          params.messageBar.removeMessage(function (error) { return error.id === errorMessageId; });
          if (response.errorMessage.length > 0) {
            var messagetoAdd = { id: errorMessageId, text: response.errorMessage, actions: [], closable: true };
            if (response.error) {
              if (response.value === "popup") {
                params.messageBar.addMessage("error", messagetoAdd);
                params.errorPopupResult = 1;
              } else {
                params.messageBarMain.addMessage("error", messagetoAdd);
              }
              params.aborted = true;
              return;
            } else {
              params.aborted = false;
              params.messageBarMain.addMessage("notification", messagetoAdd);
            }
          }
        },
        async: false
      });
    }
  };
});