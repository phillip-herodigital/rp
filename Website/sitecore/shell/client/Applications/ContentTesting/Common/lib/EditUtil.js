define([], function () {
  var target = window;
  if (target.parent)
  {
    var parent = target.parent;
    while (target.location.href != parent.location.href)
    {
      target = parent;
      parent = target.parent;
    }
  }
    

  return {
    openPageEditor: function (id, language) {
      var url = "/?sc_mode=edit";
      url = _sc.Helpers.url.addQueryParameters(url, {
        sc_itemid: id,
        sc_lang: language
      });
      target.location.href = url;
    },

    openPageTestPage: function (id, showReport, load, language) {
      if (!showReport) {
        showReport = false;
      }

      if (!load) {
        load = false;
      }

      var url = "/sitecore/client/Applications/ContentTesting/ExperienceOptimization/Dashboard/PageTest";
      url = _sc.Helpers.url.addQueryParameters(url, {
        page: id,
        report: showReport,
        load: load,
        language: language
      });
      target.location.href = url;
    }
  };
});