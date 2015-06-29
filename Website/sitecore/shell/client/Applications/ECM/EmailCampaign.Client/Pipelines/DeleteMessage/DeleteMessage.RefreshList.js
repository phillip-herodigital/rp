define(["sitecore"], function (sitecore) {
return {
    priority: 4,
    execute: function (context) {
      context.currentContext.datasource.refreshLoaded();
    }
  };
});