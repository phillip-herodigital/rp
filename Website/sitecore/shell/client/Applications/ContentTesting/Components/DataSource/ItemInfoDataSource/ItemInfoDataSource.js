define([
  "sitecore",
  "/-/speak/v1/contenttesting/DataUtil.js",
  "/-/speak/v1/contenttesting/RequestUtil.js"
], function (Sitecore, dataUtil, requestUtil) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function () {
      this.set({
        isBusy: false,
        invalidated: false,
        actionUrlForId: "/sitecore/shell/api/ct/ItemInfo/GetById",
        actionUrlForUri: "/sitecore/shell/api/ct/ItemInfo/GetByUri",
        itemId: null,
        itemUri: null,
        name: null,
        version: null,
        revision: null,
        languageIcon: null,
        language: null,
        status: null,
        testCreated: null,
        testCreatedShort: null,
        testCreatedBy: null,
        created: null,
        createdShort: null,
        createdBy: null,
        lastTest: null,
        lastTestShort: null,
        lastTestBy: null,
        lastTestVersion: null,
        dailyVisitors: null,
        bounceRate: null,
        averageDuration: null,
        warnings: null,
        hasWarnings: false,
        hasActiveTest: false
      });

      this.on("change:itemUri", this.updateItemId, this);
      this.on("change:itemId change:itemUri", this.refresh, this);
    },

    updateItemId: function(){
      var uri = new dataUtil.DataUri(this.get("itemUri"));
      this.set("itemId", uri.id);
    },

    refresh: function () {
      if (this.get("isBusy")) {
        this.set("invalidated", true);
        return;
      }

      if (this.get("itemId") || this.get("itemUri")) {

        this.set("isBusy", true);
        this.set("invalidated", false);

        var url = "";
        if (this.get("itemUri")) {
          url = this.get("actionUrlForUri") + "?uri=" + encodeURIComponent(this.get("itemUri"));
        } else if (this.get("itemId")) {
          url = this.get("actionUrlForId") + "?id=" + this.get("itemId");
        }

        var ajaxOptions = {
          cache: false,
          url: url,
          context: this,
          success: function(data) {
            this.set("isBusy", false);
            if (this.get("invalidated")) {
              this.refresh();
            } else {
              this.set({
                name: data.Name,
                version: data.Version,
                revision: data.Revision,
                languageIcon: data.LanguageIcon,
                language: data.Language,
                status: data.TestStatus,
                testCreated: data.TestCreatedDate,
                testCreatedShort: data.TestCreatedDateShort,
                testCreatedBy: data.TestCreatedBy,
                created: data.CreatedDate,
                createdShort: data.CreatedDateShort,
                createdBy: data.CreatedBy,
                lastTest: data.LastTest,
                lastTestShort: data.LastTestShort,
                lastTestBy: data.LastTestBy,
                lastTestVersion: data.LastTestVersion,
                dailyVisitors: data.DailyVisitors,
                bounceRate: data.BounceRate,
                averageDuration: data.AverageDuration,
                warnings: data.Warnings,
                hasWarnings: data.Warnings && data.Warnings.length > 0,
                hasActiveTest: data.HasActiveTest
              });
            }
          },
          error: function(req, status, error) {
            alert(error);
            console.log("ItemInfoDataSource ajax failed");
            console.log(status);
            console.log(error);
            console.log(req);
          }
        };

        requestUtil.performRequest(ajaxOptions);
      }
    },
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function () {
      this._super();

      // stop refreshing while initial settings are read
      this.model.set("isBusy", true);

      this.model.set("itemId", this.$el.attr("data-sc-itemid"));
      this.model.set("itemUri", this.$el.attr("data-sc-itemuri"));

      // settings have completed reading. Resume
      this.model.set("isBusy", false);
      this.model.refresh();
    }
  });

  Sitecore.Factories.createComponent("ItemInfoDataSource", model, view, "script[type = 'x-sitecore-iteminfodatasource']");
});