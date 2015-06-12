define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js", "/-/speak/v1/ecm/String.js"], function(sitecore) {
return {
    priority: 3,
    execute: function (context) {
      if (!context.confirmed) {
        context.aborted = true;
        return;
      }
      
      postServerRequest("ecm.copytodraft.execute", { sourceMessageId: context.messageId, messageName: context.messageName }, function(response) {
        if (response.error) {
          sitecore.trigger("alertdialog", response.errorMessage);
          context.aborted = true;
          return;
        }
        
        context.messageId = response.value;
      }, false);

    }
  };
});