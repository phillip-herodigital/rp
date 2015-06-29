define(["sitecore"], function (Sitecore) {
  return {
    priority: 2,
    execute: function (context) {
      window.top.onbeforeunload = {};
      Sitecore.ExperienceEditor.modifiedHandling();
    }
  };
});