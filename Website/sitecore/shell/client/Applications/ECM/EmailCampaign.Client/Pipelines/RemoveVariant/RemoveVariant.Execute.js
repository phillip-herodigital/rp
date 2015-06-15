define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
return {
  	priority: 1,
  	execute: function (context) {
  		postServerRequest("ecm.removevariant.remove", { messageId: context.currentContext.messageId, variantId: context.currentContext.variantId, language: context.currentContext.language }, function (response) {
  		  context.currentContext.messageBar.removeMessage(function (error) { return error.id === "error.ecm.addvariant.remove"; });
  		  if (response.error) {
  		    var messagetoAdd = { id: "error.ecm.addvariant.remove", text: response.errorMessage, actions: [], closable: false };
  		    context.currentContext.messageBar.addMessage("error", messagetoAdd);
  				context.currentContext.errorCount = 1;
  				context.aborted = true;
  		  }
  		  context.app.MessageContext.set("isBusy", false);
  		}, false);
  	}
  };
});