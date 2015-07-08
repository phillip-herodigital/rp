define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function (sc, providerHelper, cintelUtil) {
  var intelPath = "/intel",
      cintelTableNameProperty = "cintelTableName",
      outcomeTable = "journey-detail-outcome",
      cidParam = "cid";

  var app = sc.Definitions.App.extend({
    initialized: function () {
      var contactId = cintelUtil.getQueryParam(cidParam),
          baseUrl = "/sitecore/api/ao/v1/contacts/" + contactId;

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + outcomeTable, headerValue: outcomeTable }
      ]);

      sc.off("showOutcomeApp").on("showOutcomeApp", function (application, timeLineEventId) {
          providerHelper.initProvider(application.OutcomeDataProvider, outcomeTable, baseUrl + intelPath + "/" + outcomeTable + "/" + timeLineEventId);

        providerHelper.getData(
        application.OutcomeDataProvider,
        $.proxy(function (jsonData) {
          var dataSet = jsonData.data.dataSet[application.OutcomeDataProvider.get(cintelTableNameProperty)];
          if (!dataSet || dataSet.length < 1) {
            return;
          }

          var data = dataSet[0];
          this.RecencyValue.set("text", data.FormattedOutcomeDateTime);
          this.SourceHyperlinkButton.set("text", data.SourceSystemDisplayName);
          this.SourceHyperlinkButton.set("navigateUrl", "http://" + data.SourceSystemUrl);

          this.ChannelValue.set("text", data.ChannelDisplayName);
          this.GoalsValue.set("text", data.GoalDisplayNameList);
          this.OutcomeValue.set("text", data.OutcomeDefinitionDisplayName);
          
          this.CampaignValue.set("text", data.CampaignDisplayName);
          this.AssetValue.set("text", data.AssetDisplayNameList);

          if (data.OutcomeMonetaryValue != null) {
              this.SalesAmountValue.set("text", "$" + data.OutcomeMonetaryValue);
          } else {
              this.SalesAmountValue.set("text", "N/A");
          }

          this.DurationValue.set("text", data.TimeOnPage);
          this.VisitNumberValue.set("text", data.InteractionIndex);
          this.ValueGeneratedValue.set("text", data.InteractionEngagementValue);

        }, this)
      );
      }, this);

    }
  });
  return app;
});
