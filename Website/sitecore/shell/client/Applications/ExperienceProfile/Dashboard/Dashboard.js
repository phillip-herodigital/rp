define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil)
{
  var app = sc.Definitions.App.extend({
    initialized: function ()
    {
      var aggregatesPath = "/aggregates";
      var latestVisitorsTable = "latest-visitors";

      providerHelper.setupHeaders([
        { urlKey: aggregatesPath + "/" + latestVisitorsTable + "?", headerValue: latestVisitorsTable }
      ]);

      var url = "/sitecore/api/ao/v1" + aggregatesPath + "/" + latestVisitorsTable;
      providerHelper.initProvider(this.VisitorsDataProvider, latestVisitorsTable, url, this.DashboardMessageBar);
      providerHelper.subscribeSorting(this.VisitorsDataProvider, this.VisitorsList);

      providerHelper.setDefaultSorting(this.VisitorsDataProvider, "LatestVisitStartDateTime", true);
      providerHelper.getListData(this.VisitorsDataProvider);
      
      this.VisitorsList.on("change:items", cintelUtil.removeMailLink, this.VisitorsList);
    },

    findContact: function () {
      window.location.assign('search?text=' + encodeURIComponent(this.SearchTextBox.get('text') || "*"));
    }
  });
  return app;
});