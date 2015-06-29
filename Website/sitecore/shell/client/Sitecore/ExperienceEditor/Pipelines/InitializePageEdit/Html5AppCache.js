define(["sitecore"], function (Sitecore) {
  return {
    priority: 1,
    execute: function (context) {
      try {
        Sitecore.ExperienceEditor.Web.updateHtml5Cache();
      } catch (err) {}
    }
  };
});