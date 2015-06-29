require.config({
  baseUrl: '/sitecore/shell/client/Applications/ContentTesting/Common/lib'
});

define(["DataUtil"], function (dataUtil) {
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
      var uri = new dataUtil.DataUri();
      uri.id = id;
      uri.lang = language;

      this.openPageEditor(uri);
    },

    openPageEditor: function (uri) {
      var url = "/?sc_mode=edit";
      var parsedUri = new dataUtil.DataUri(uri);

      url = _sc.Helpers.url.addQueryParameters(url, {
        sc_itemid: parsedUri.id,
        sc_lang: parsedUri.lang,
        sc_version: parsedUri.ver
      });
      target.location.href = url;
    },

    openPageTestPage: function (id, showReport, load, language) {
      var uri = new dataUtil.DataUri();
      uri.id = id;
      uri.lang = language;

      this.openPageTestPage(uri, showReport, load);
    },

    openPageTestPage: function (uri, showReport, load) {
      if (!showReport) {
        showReport = false;
      }

      if (!load) {
        load = false;
      }

      if (!(uri instanceof dataUtil.DataUri)) {
        uri = new dataUtil.DataUri(uri);
      }

      var url = "/sitecore/client/Applications/ContentTesting/ExperienceOptimization/Dashboard/PageTest";

      url = _sc.Helpers.url.addQueryParameters(url, {
        hostUri: uri.toString(),
        report: showReport,
        load: load
      });
      target.location.href = url;
    }
  };
});