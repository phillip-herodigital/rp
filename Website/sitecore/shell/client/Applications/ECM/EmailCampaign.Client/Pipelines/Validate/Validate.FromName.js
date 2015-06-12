define(["sitecore"], function (sitecore) {
return {
    priority: 4,
    execute: function (context) {
      if (!fromNameIsValid(context.currentContext.message.sender.name, context.currentContext.message.sender.email, context.currentContext.messageBar, sitecore)) {
        context.currentContext.errorCount = context.currentContext.errorCount + 1;
      }
    }
  };
});