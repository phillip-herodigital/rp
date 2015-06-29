define(["sitecore", "/-/speak/v1/ecm/Validation.js"], function (sitecore) {
return {
    priority: 1,
    execute: function (context) {
      if (!nameIsValid(context.currentContext.message.name, context.currentContext.messageBar, sitecore)) {
        context.currentContext.errorCount = context.currentContext.errorCount + 1;
      }
    }
  };
});