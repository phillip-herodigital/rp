define(["sitecore"], function (sitecore) {
  return {
    priority: 2,
    execute: function (context) {
      console.log("notify");
      sitecore.trigger("attachment:file:removed");
    }
  };
});