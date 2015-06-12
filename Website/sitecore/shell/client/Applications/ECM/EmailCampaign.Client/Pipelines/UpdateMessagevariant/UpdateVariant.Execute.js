define(["sitecore", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore) {
	sitecore.Pipelines.UpdateVariant = sitecore.Pipelines.UpdateVariant || new sitecore.Pipelines.Pipeline("UpdateVariant");
	var update =
  {
  	priority: 1,
  	execute: function (context) {
  		postServerRequest("ecm.UpdateMessageVariant.update", { messageId: context.currentContext.messageId, variantId: context.currentContext.variantId, subject: context.currentContext.subject, body: context.currentContext.body, alternativeText: context.currentContext.alternativeText, language: context.currentContext.language }, function (response) {
  			if (response.error) {
  				context.currentContext.messageBar.addMessage("error", response.errorMessage);
  				context.currentContext.errorCount = 1;
  				context.aborted = true;
  				return;
  			}

  			context.currentContext.messageBar.removeMessage(function (error) { return error.id === "notUpdateVariant"; });
  			if (!response.value) {
  				var messagetoAdd = { id: "notUpdateVariant", text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.UpdateVariant.NotDuplicated"), actions: [], closable: false };
  				context.currentContext.messageBar.addMessage("error", messagetoAdd);
  				context.currentContext.errorCount = 1;
  				context.aborted = true;
  				return;
  			}
  		}, false);
  	}
  };
	sitecore.Pipelines.UpdateVariant.add(update);
});