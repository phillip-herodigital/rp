define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
  return {
    priority: 1,
    execute: function (c) {
      postServerRequest("ecm.exporttocsv.geturl", c.currentContext, function (response) {
        if (response.error) {
          var messagetoAdd = { id: "error.ecm.exporttocsv.geturl", text: response.errorMessage, actions: [], closable: false };
          c.currentContext.messageBar.addMessage("error", messagetoAdd);
          c.currentContext.errorCount = 1;
          c.aborted = true;
          return;
        }
        
        c.currentContext.url = response.value;
      }, false);
    }
  };
});