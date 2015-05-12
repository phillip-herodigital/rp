define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js"], function (sc, providerHelper)
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
      
      this.VisitorsList.on("change:items", this.removeMailLink, this);
    },

    findContact: function () {
      window.location.assign('search?text=' + encodeURIComponent(this.SearchTextBox.get('text')));
    },

    removeMailLink: function () {
      this.VisitorsList.viewModel.$el.find("a").each(function () {
        $(this).attr("href") == "mailto:" ?
          $(this).removeAttr("href") : $.noop();
      });
    }
  });
  return app;
});