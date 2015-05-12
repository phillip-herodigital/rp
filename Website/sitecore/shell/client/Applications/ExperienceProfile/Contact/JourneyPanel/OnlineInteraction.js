define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil) {
  var intelPath = "/intel",
      cintelTableNameProperty = "cintelTableName",
      onlineTable = "journey-detail-online-interaction",
      cidParam = "cid";

  var app = sc.Definitions.App.extend({
    initialized: function () {
      var contactId = cintelUtil.getQueryParam(cidParam),
          baseUrl = "/sitecore/api/ao/v1/contacts/" + contactId;

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + onlineTable, headerValue: onlineTable }
      ]);

      sc.off("showOnlineInteractionApp").on("showOnlineInteractionApp", function (application, timeLineEventId) {
        providerHelper.initProvider(application.OnlineDataProvider, onlineTable, baseUrl + intelPath + "/" + onlineTable + "/" + timeLineEventId);

        providerHelper.getData(
        application.OnlineDataProvider,
        $.proxy(function (jsonData) {
          var dataSet = jsonData.data.dataSet[application.OnlineDataProvider.get(cintelTableNameProperty)];
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

          this.TimeText.set("text", data.TimeOnPage);
          this.VisitNumberText.set("text", data.InteractionIndex);
          this.ValueGeneratedText.set("text", data.InteractionEngagementValue);
          this.PageviewsText.set("text", data.InteractionPageViewCount);

          this.LocationValue.set("text", data.LocationDisplayName);
          this.RecencyValue.set("text", data.FormattedInteractionStartDateTime);
        }, this)
      );
      }, this);
    }

  });
  return app;
});