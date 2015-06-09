define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil) {
  var intelPath = "/intel",
      cintelTableNameProperty = "cintelTableName",
      offlineTable = "journey-detail-offline-interaction",
      cidParam = "cid";
      
  var app = sc.Definitions.App.extend({
    initialized: function () {
      var contactId = cintelUtil.getQueryParam(cidParam),
          baseUrl = "/sitecore/api/ao/v1/contacts/" + contactId;

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + offlineTable, headerValue: offlineTable }
      ]);

      sc.off("showOfflineInteractionApp").on("showOfflineInteractionApp", function (application, timeLineEventId) {
        providerHelper.initProvider(application.OfflineDataProvider, offlineTable, baseUrl + intelPath + "/" + offlineTable + "/" + timeLineEventId);
        
        providerHelper.getData(
        application.OfflineDataProvider,
        $.proxy(function (jsonData) {
          var dataSet = jsonData.data.dataSet[application.OfflineDataProvider.get(cintelTableNameProperty)];
          if (!dataSet || dataSet.length < 1) {
            return;
          }

          var data = dataSet[0];
          this.ChannelValue.set("text", data.InteractionChannelDisplayName);
          this.GoalValue.set("text", data.GoalDisplayNameList);
          this.CampaignValue.set("text", data.CampaignDisplayName);
          this.AssetValue.set("text", data.AssetDisplayNameList);
                   
          cintelUtil.setTitle(this.AssetValue, data.AssetDisplayNameList);
          cintelUtil.setTitle(this.GoalValue, data.GoalDisplayNameList);
          cintelUtil.setTitle(this.CampaignValue, data.CampaignDisplayName);

          this.TimeText.set("text", data.DurationDisplayValue);       
          this.VisitNumberText.set("text", data.TouchPointViewCount);
          this.ValueGeneratedText.set("text", data.InteractionEngagementValue);

          this.SourceHyperlinkButton.set("text", data.SourceSystemDisplayName);
          this.SourceHyperlinkButton.set("navigateUrl", "http://" + data.SourceSystemUrl);
          this.RecencyValue.set("text", data.FormattedInteractionStartDateTime);

        }, this)
      );
      }, this);
      
    }
  });
  return app;
});
