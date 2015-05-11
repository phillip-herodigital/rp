define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js"], function (sc, providerHelper)
{
  var app = sc.Definitions.App.extend({
    initialized: function ()
    {
      var intelPath = "/intel";
      var visitsTable = "visits";
      var eventsTable = "events";

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + visitsTable + "?", headerValue: visitsTable },
        { urlKey: intelPath + "/" + eventsTable + "?", headerValue: eventsTable }
      ]);

      var intelBaseUrl = sc.Contact.baseUrl +intelPath + "/";

      providerHelper.initProvider(this.VisitsDataProvider, visitsTable, intelBaseUrl + visitsTable, this.VisitTabMessageBar);
      providerHelper.subscribeSorting(this.VisitsDataProvider, this.VisitsList);
      providerHelper.setDefaultSorting(this.VisitsDataProvider, "VisitStartDateTime", true);
      providerHelper.getListData(this.VisitsDataProvider);

      providerHelper.initProvider(this.EventsDataProvider, eventsTable, intelBaseUrl + eventsTable, this.VisitTabMessageBar);
      providerHelper.subscribeSorting(this.EventsDataProvider, this.EventsList);
      providerHelper.setDefaultSorting(this.EventsDataProvider, "EventDateTime", true);
      providerHelper.getListData(this.EventsDataProvider);

      providerHelper.subscribeAccordionHeader(this.VisitsDataProvider, this.VisitsAccordion);
      providerHelper.subscribeAccordionHeader(this.EventsDataProvider, this.EventsAccordion);

      sc.Contact.subscribeVisitDialog(this.VisitsList);
    },
  });
  return app;
});