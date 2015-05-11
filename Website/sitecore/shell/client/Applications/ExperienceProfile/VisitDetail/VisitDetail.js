define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil)
{
  var cidParam = "cid",
      visitidParam = "visitid",

      isVisibleProperty = "isVisible",
      intelPath = "/intel",
    
      visitsummaryTable = "visit-summary",
      visitPagesTable = "visit-pages",
      lateststatisticsTable = "latest-statistics", 
      visitInternalSearchesTable = "visit-internal-searches",
      visitGoalsTable = "visit-goals",
      visitSummaryTable = "visit-summary";

  var baseUrl;

  var app = sc.Definitions.App.extend({
    initialized: function ()
    {
      sc.trigger("VisitDetailApp", this);
      var visitId = cintelUtil.getQueryParam(visitidParam),
          contactId = cintelUtil.getQueryParam(cidParam);

      if (!contactId) return;
      $(".sc-list").show();

      this.VisitDialogPhoto.viewModel.$el.on("click", function () {
        window.location.assign("contact?cid=" + contactId);
      });
      
      sc.trigger("VisitDetailApp", this);
      
      baseUrl = "/sitecore/api/ao/v1/contacts/" + contactId;

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + visitsummaryTable, headerValue: visitsummaryTable },
        { urlKey: intelPath + "/" + lateststatisticsTable + "?", headerValue: lateststatisticsTable },
        { urlKey: intelPath + "/" + visitPagesTable, headerValue: visitPagesTable }
      ]);

      $('.sc-progressindicator').first().show().hide(); // prefetch indicator background images

      this.MainBorder.set(isVisibleProperty, true);

      providerHelper.initProvider(this.PagesInVisitDataProvider, visitPagesTable, null, this.VisitDialogMessageBar);
      providerHelper.initProvider(this.InternalSearchDataProvider, visitInternalSearchesTable, null, this.VisitDialogMessageBar);
      providerHelper.initProvider(this.DialogGoalsDataProvider, visitGoalsTable, null, this.VisitDialogMessageBar);
      providerHelper.initProvider(this.DialogVisitSummaryProvider, visitSummaryTable, null, this.VisitDialogMessageBar);
      providerHelper.initProvider(this.ContactDetailsDataProvider, "", baseUrl, this.ContactTabMessageBar);

      providerHelper.subscribeSorting(this.PagesInVisitDataProvider, this.PagesInVisitList);
      providerHelper.subscribeSorting(this.InternalSearchDataProvider, this.InternalSearchList);
      providerHelper.subscribeSorting(this.DialogGoalsDataProvider, this.DialogGoalsList);

      providerHelper.subscribeAccordionHeader(this.PagesInVisitDataProvider, this.PagesInVisitAccordion);
      providerHelper.subscribeAccordionHeader(this.InternalSearchDataProvider, this.InternalSearchAccordion);
      providerHelper.subscribeAccordionHeader(this.DialogGoalsDataProvider, this.DialogGoalsAccordion);

      this.open(this, visitId);
    },
    
    open: function (application, visitId) {
      if (!visitId) return;

      var dataUrlProperty = "dataUrl",
          intelBaseUrl = baseUrl + "/intel/";
      
      application.PagesInVisitDataProvider.set(dataUrlProperty, intelBaseUrl + visitPagesTable + "/" + visitId);
      application.InternalSearchDataProvider.set(dataUrlProperty, intelBaseUrl + visitInternalSearchesTable + "/" + visitId);
      application.DialogGoalsDataProvider.set(dataUrlProperty, intelBaseUrl + visitGoalsTable + "/" + visitId);
      application.DialogVisitSummaryProvider.set(dataUrlProperty, intelBaseUrl + visitSummaryTable + "/" + visitId);

      application.VisitDialogMessageBar.removeMessages("error");
      application.VisitDialogMessageBar.removeMessages("warning");
      application.VisitDialogMessageBar.removeMessages("notification");

      providerHelper.getListData(application.PagesInVisitDataProvider, application.PagesInVisitList);
      providerHelper.getListData(application.InternalSearchDataProvider, application.InternalSearchList);
      providerHelper.getListData(application.DialogGoalsDataProvider, application.DialogGoalsList);

      providerHelper.getData(
        application.ContactDetailsDataProvider,
        $.proxy(function (jsonData) {
          cintelUtil.setText(this.VisitDialogContactName, cintelUtil.getFullName(jsonData), true);
          this.VisitDialogPhoto.set("imageUrl", baseUrl + "/image?w=72&h=72");
          cintelUtil.setText(this.VisitDialogTotalVisits, jsonData.visitCount, true);
          var infoEmailLink = jsonData.preferredEmailAddress.Key ?
              jsonData.preferredEmailAddress.Value.SmtpAddress :
              jsonData.emailAddresses[0].Value.SmtpAddress;

          cintelUtil.setText(this.VisitDialogContactEmail, infoEmailLink, true);
          cintelUtil.setText(this.VisitDialogContactProfession, jsonData.jobTitle, true);
          this.VisitDialogContactEmail.viewModel.$el.attr("href", "mailto:" + infoEmailLink);
        }, application)
      );


      providerHelper.getData(
        application.DialogVisitSummaryProvider,
        $.proxy(function () {
          var data = application.DialogVisitSummaryProvider.get("data").dataSet[visitSummaryTable][0];

          cintelUtil.setText(application.VisitDialogTime, data.FormattedVisitStartDateTime, true);
          cintelUtil.setText(application.VisitDialogLocation, data.LocationDisplayName, true);
          cintelUtil.setText(application.VisitDialogCurrentVisit, data.VisitIndex, true);
          cintelUtil.setText(application.VisitDialogPageviews, data.VisitPageViewCount, true);
          cintelUtil.setText(application.VisitDialogVisitTime, data.VisitTime, true);
          cintelUtil.setText(application.VisitDialogValue, data.VisitValue, true);
          cintelUtil.setText(application.TrafficChannel, data.TrafficTypeDisplayName, true);

          cintelUtil.setText(application.Campaign, data.CampaignDisplayName, false);
          cintelUtil.setText(application.ExternalKeyword, data.ExternalKeyword, false);
        }, application)
      );
    }
  
  });
  return app;
});