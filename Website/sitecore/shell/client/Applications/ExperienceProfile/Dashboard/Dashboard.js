define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js"], function (sc, providerHelper)
{
  var app = sc.Definitions.App.extend({
    initialized: function ()
    {
      var aggregatesPath = "/aggregates";
      var latestVisitorsTable = "latest-visitors";

      this.SearchTextBox.viewModel.$el.keyup($.proxy(function (e)
      {
        if (e.keyCode == 13)
        {
          this.SearchButton.viewModel.click();
        }
      }, this));

      providerHelper.setupHeaders([
        { urlKey: aggregatesPath + "/" + latestVisitorsTable + "?", headerValue: latestVisitorsTable }
      ]);

      var url = "/sitecore/api/ao/v1" + aggregatesPath + "/" + latestVisitorsTable;
      providerHelper.initProvider(this.VisitorsDataProvider, latestVisitorsTable, url, this.DashboardMessageBar);
      providerHelper.subscribeSorting(this.VisitorsDataProvider, this.VisitorsList);

      providerHelper.setDefaultSorting(this.VisitorsDataProvider, "LatestVisitStartDateTime", true);
      providerHelper.getListData(this.VisitorsDataProvider);
    },
    
    findContact: function()
    {
      window.location.assign('search?text=' + encodeURIComponent(this.SearchTextBox.get('text')));
    }
  });
  return app;
});