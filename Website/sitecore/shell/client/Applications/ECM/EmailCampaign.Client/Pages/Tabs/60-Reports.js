require.config({
  paths: {
    experienceAnalytics: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalytics"
  }
});

define(["sitecore", "experienceAnalytics", "/-/speak/v1/ecm/ReportTab.js", "/-/speak/v1/ecm/ServerRequest.js"], function (sitecore, ExperienceAnalytics) {
  var deliveryTab = sitecore.Definitions.App.extend({
    messagePerformanceLanguageSpecificId: "MessagePerformanceLanguageSpecific",
    messagePerformanceAllLanguagesId: "MessagePerformanceAllLanguages",
    chartsLoaded: 0,
    allLanguagesChart: null,
    languageSpecificChart: null,
    languageSpecificLineChart: null,
    languageSpecificDataProvider: null,
    languageSpecificChartLanguage: "all",

    initialized: function () {
      var contextApp = this;
      sitecore.trigger("mainApp", this);

      initReportTab(sitecore, contextApp);

      // init
      contextApp.setLanguage(contextApp);
      contextApp.setMessageId(contextApp);

      sitecore.on("change:messageContext", function () {
        contextApp.updateStatisticsEntries(contextApp);
      });

      contextApp.MessageContext.on("change:selectedReportLanguage", function () {
        contextApp.setLanguage(contextApp);
        contextApp.updateCharts();
      });

      sitecore.trigger("change:messageContext");

      sitecore.on("chart:loaded", contextApp.initCharts, this);
    },

    // once
    setMessageId: function (contextApp) {
      var messageId = contextApp.MessageContext.get("messageId");
      contextApp.BestEmailLandingPagesDataSource.set("messageId", messageId);
      contextApp.EmailLandingPagesPerformanceDataSource.set("messageId", messageId);
      contextApp.UnsubscribersDataSource.set("messageId", messageId);
      contextApp.EmailBouncesDetailsDataSource.set("messageId", messageId);
      contextApp.MessagePerformancePerLanguageDataSource.set("messageId", messageId);
      contextApp.LandingPagesValueDataSource.set("messageId", messageId);
      contextApp.LandingPagesVisitsDataSource.set("messageId", messageId);
      contextApp.LandingPagesAttentionDataSource.set("messageId", messageId);
      contextApp.LandingPagesPotentialDataSource.set("messageId", messageId);
      contextApp.LandingPagesValuePerVisitDataSource.set("messageId", messageId);
      
    },

    setLanguage: function (contextApp) {
      var language = contextApp.MessageContext.get("selectedReportLanguage");

      contextApp.BestEmailLandingPagesDataSource.set("language", language);
      contextApp.EmailLandingPagesPerformanceDataSource.set("language", language);
      contextApp.UnsubscribersDataSource.set("language", language);
      contextApp.EmailBouncesDetailsDataSource.set("language", language);
      contextApp.MessagePerformancePerLanguageDataSource.set("language", language);
      contextApp.LandingPagesValueDataSource.set("language", language);
      contextApp.LandingPagesVisitsDataSource.set("language", language);
      contextApp.LandingPagesAttentionDataSource.set("language", language);
      contextApp.LandingPagesPotentialDataSource.set("language", language);
      contextApp.LandingPagesValuePerVisitDataSource.set("language", language);
    },

    updateStatisticsEntries: function (contextApp) {
      contextApp.TotalRecipientsValue.set("text", contextApp.MessageContext.get("totalRecipients"));
      contextApp.ActualRecipientsValue.set("text", contextApp.MessageContext.get("actualRecipients"));
      contextApp.OpenedValue.set("text", contextApp.MessageContext.get("opened"));
      contextApp.ClickedValue.set("text", contextApp.MessageContext.get("clicked"));
      contextApp.BrowsedValue.set("text", contextApp.MessageContext.get("browsed"));
      contextApp.ProductiveValue.set("text", contextApp.MessageContext.get("productive"));

      contextApp.ValuesValue.set("text", contextApp.MessageContext.get("value"));
      contextApp.ValuesVisitValue.set("text", contextApp.MessageContext.get("valuePerVisit"));
      contextApp.VisitEmailValue.set("text", contextApp.MessageContext.get("visitsPerEmail"));
      contextApp.ValuesEmailValue.set("text", contextApp.MessageContext.get("valuePerEmail"));
    },

    initCharts: function () {
      this.chartsLoaded++;

      if (this.chartsLoaded === 2) {
        var messageId = this.MessageContext.get("messageId"),
          managerRootId = sessionStorage.managerRootId,
          contextApp = this;

        postServerRequest("EXM/ReportKey", { 'managerRootId': managerRootId, 'messageId': messageId }, function (response) {
          var startDate = new Date(),
            endDate = new Date();

          contextApp.setChartModels();
          contextApp.showCharts();
          startDate.setDate(startDate.getDate() - 6);

          var formattedStartDate = ExperienceAnalytics.reConvertDateFormat($.datepicker.formatDate("dd-mm-yy", startDate));
          var formattedEndDate = ExperienceAnalytics.reConvertDateFormat($.datepicker.formatDate("dd-mm-yy", endDate));

          contextApp.allLanguagesChart.set("keys", response.value);

          ExperienceAnalytics.setDateRange(formattedStartDate, formattedEndDate);
        });
        
      }
    },

    setChartModels: function () {
      var allLanguagesApp = this[this.messagePerformanceAllLanguagesId + "App"];
      var languageSpecificApp = this[this.messagePerformanceLanguageSpecificId + "App"];

      this.allLanguagesChart = allLanguagesApp[this.messagePerformanceAllLanguagesId];
      this.languageSpecificChart = languageSpecificApp[this.messagePerformanceLanguageSpecificId];
      this.languageSpecificLineChart = languageSpecificApp[this.messagePerformanceLanguageSpecificId + "LineChart"];
      this.languageSpecificDataProvider = languageSpecificApp[this.messagePerformanceLanguageSpecificId + "DataProvider"];
    },

    showCharts: function () {
      var language = this.getLanguage(this);
      this.allLanguagesChart.set("isVisible", language === "all");
      var that = this;
      setTimeout(function () { that.languageSpecificChart.set("isVisible", language !== "all"); }, 100);
    },

    updateCharts: function () {
      var language = this.getLanguage();

      this.showCharts();
      

      if (language !== "all" && this.languageSpecificChartLanguage !== language) {
        var messageId = this.MessageContext.get("messageId"),
          managerRootId = sessionStorage.managerRootId,
          contextApp = this;

        postServerRequest("EXM/ReportKey", { 'managerRootId': managerRootId, 'messageId': messageId, 'reportLanguage': language }, function (response) {
          var dateRange = ExperienceAnalytics.getDateRange(),
            parameters = sitecore.Helpers.url.getQueryParameters(contextApp.languageSpecificChart.get("keysByMetricQuery"));

          parameters.dateFrom = ExperienceAnalytics.convertDateFormat(dateRange.dateFrom);
          parameters.dateTo = ExperienceAnalytics.convertDateFormat(dateRange.dateTo);
          parameters.keyGrouping = contextApp.languageSpecificChart.get("keyGrouping");

          contextApp.languageSpecificChart.set("keys", response.value);
          contextApp.languageSpecificChart.viewModel.setChartProperties(contextApp.languageSpecificLineChart);
          contextApp.languageSpecificChart.viewModel.getData(parameters, ExperienceAnalytics.getSubsite(), contextApp.languageSpecificChart.get("timeResolution"));
          contextApp.languageSpecificChartLanguage = language;
        });
      }
    },

    getLanguage: function () {
      return this.MessageContext.get("selectedReportLanguage") === "0" ? "all" : this.MessageContext.get("selectedReportLanguage");
    }

  });

  return deliveryTab;
});
