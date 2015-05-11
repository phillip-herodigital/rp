define(["sitecore", "/-/speak/v1/experienceprofile/DataProviderHelper.js", "/-/speak/v1/experienceprofile/CintelUtl.js"], function(sc, providerHelper, cintelUtil)
{
  var mainApp,
      cidParam = "cid",
      selectedItemIdProperty = "selectedItemId",
      textProperty = "text",
      isVisibleProperty = "isVisible",
      cintelTableNameProperty = "cintelTableName",
      selectedTabProperty = "selectedTab",

      intelPath = "/intel",
      visitsummaryTable = "visit-summary",
      visitPagesTable = "visit-pages",
      lateststatisticsTable = "latest-statistics",
      visitDialogApp;

  var app = sc.Definitions.App.extend({
    initialized: function()
    {
      mainApp = this;

      $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1.0" />'); // workaround for responsive design

      var contactId = cintelUtil.getQueryParam(cidParam);
      if(!contactId) return;

      this.isSkinnyMode();

      sc.on("VisitDetailApp", function(subapp)
      {
        visitDialogApp = subapp;
        subapp.VisitDialogPhoto.viewModel.$el.off("click");
      }, this);

      $(".sc-list").show();

      var baseUrl = "/sitecore/api/ao/v1/contacts/" + contactId;

      sc.Contact = {
        baseUrl: baseUrl,
        subscribeVisitDialog: function(listControl)
        {
          listControl.on("change:" + selectedItemIdProperty, function()
          {
            if(!listControl.get(selectedItemIdProperty)) return;
            this.openVisitDialog(listControl.get("selectedItem").get("VisitId"));
            listControl.set(selectedItemIdProperty, null);
          }, mainApp);
        }
      };

      providerHelper.setupHeaders([
        { urlKey: intelPath + "/" + visitsummaryTable, headerValue: visitsummaryTable },
        { urlKey: intelPath + "/" + lateststatisticsTable + "?", headerValue: lateststatisticsTable },
        { urlKey: intelPath + "/" + visitPagesTable, headerValue: visitPagesTable }
      ]);

      $('.sc-progressindicator').first().show().hide(); // prefetch indicator background images

      this.processTabs();

      this.MainBorder.set(isVisibleProperty, true);

      this.initInfoPanel(baseUrl, contactId);

      this.openLatestVisit();
    },

    initInfoPanel: function(baseUrl, contactId)
    {
      this.InfoBorder.set(isVisibleProperty, true);

      providerHelper.initProvider(this.InfoDataProvider, lateststatisticsTable, baseUrl + intelPath + "/" + lateststatisticsTable);

      this.InfoPhotoImage.set("imageUrl", baseUrl + "/image?w=170&h=170");
      this.checkNoContact(contactId);

      providerHelper.getData(
        this.InfoDataProvider,
        $.proxy(function(jsonData)
        {
          var dataSet = jsonData.data.dataSet[this.InfoDataProvider.get(cintelTableNameProperty)];
          if(!dataSet || dataSet.length < 1)
          {
            return;
          }

          var data = dataSet[0];

          cintelUtil.setText(this.VisitTime, data.FormattedTime, false);
          cintelUtil.setText(this.VisitDate, data.FormattedDate, false);
          cintelUtil.setText(this.Recency, data.Recency, false);
          cintelUtil.setText(this.Location, data.LatestVisitLocationDisplayName, false);

          this.VisitsValue.set(textProperty, data.TotalVisitCount);
          this.ValueValue.set(textProperty, data.ContactValue);
          this.ValuePerVisitValue.set(textProperty, data.AverageValuePerVisit);

          this.PageviewsValue.set(textProperty, data.TotalPageViewCount);

          this.PagesPerVisitValue.set(textProperty, data.AveragePageViewsPerVisit);
          this.AverageVisitValue.set(textProperty, data.AverageVisit);
        }, this)
      );

      providerHelper.initProvider(this.ContactDetailsDataProvider, "", sc.Contact.baseUrl, this.ContactTabMessageBar);
      providerHelper.getData(
        this.ContactDetailsDataProvider,
        $.proxy(function(jsonData)
        {
          this.InfoContactName.set(textProperty, cintelUtil.getFullName(jsonData));
          this.InfoContactTelephone.set("text", cintelUtil.getFullTelephone(jsonData.preferredPhoneNumber.Value));

          var infoEmailLink = jsonData.preferredEmailAddress.Key ? jsonData.preferredEmailAddress.Value.SmtpAddress : "";
          if(!infoEmailLink && jsonData.emailAddresses.length > 0)
          {
            infoEmailLink = jsonData.emailAddresses[0].Value.SmtpAddress;
          }

          this.InfoEmailLink.set(textProperty, infoEmailLink);
          this.InfoEmailLink.viewModel.$el.attr("href", "mailto:" + infoEmailLink);
        }, this)
      );
    },

    checkNoContact: function(contactId)
    {
      this.ContactDetailsDataProvider.on("error", function(error)
      {
        if(error.response.status === 404)
        {
          window.location.replace("ContactNotFound?" + cidParam + "=" + contactId);
        }
      }, this);
    },

    loadPanel: function(tabId)
    {
      //TODO: remove tabId from function

      var panelId = $("[data-sc-id='TabControl'] > .tab-content > .active .sc-load-on-demand-panel").data("sc-id");
      var panel = this[panelId];

      if(panel && !panel.get("isLoaded"))
      {
        panel.on("change:isLoaded", function()
        {
          panel.set("isBusy", false);
        });

        panel.set("isBusy", true);
        panel.load();
      }
    },

    getTabIdFromUrl: function()
    {
      var tabName = cintelUtil.getQueryParam("tab");
      if(!tabName) return null;

      var tabIdControlId = tabName[0].toUpperCase() + tabName.toLowerCase().substring(1) + "TabId";
      var tabIdControl = this[tabIdControlId];
      if(!tabIdControl) return null;

      return tabIdControl.get(textProperty);
    },

    showDefaultTab: function()
    {
      var firstTabId = this.TabControl.get(selectedTabProperty);
      var urlTabId = this.getTabIdFromUrl();

      if(urlTabId && urlTabId != firstTabId)
      {
        this.TabControl.set(selectedTabProperty, urlTabId);
      } else
      {
        this.loadPanel(firstTabId);
      }
    },

    processTabs: function()
    {
      this.TabControl.on("change:" + selectedTabProperty, function(tabControl, selectedTab)
      {
        this.loadPanel(selectedTab);
      }, this);

      this.showDefaultTab();
    },

    refreshPanel: function()
    {
      var idPanel = this.TabControl.viewModel.$el.find(".sc-tabcontrol-tab:visible .sc-load-on-demand-panel").data("sc-id"),
          panel = this[idPanel];

      this.RefreshButton.set("isEnabled", false);

      panel.set("isLoaded", false);
      panel.off("change:isLoaded");
      panel.refresh();
      panel.set("isBusy", true);

      panel.on("change:isLoaded", function()
      {
        if(panel.get("isLoaded"))
        {
          panel.set("isBusy", false);
          this.RefreshButton.set("isEnabled", true);
        }
      }, this);
    },

    openLatestVisit: function()
    {
      var tableName = this.InfoDataProvider.get(cintelTableNameProperty),
          data = this.InfoDataProvider.get("data");
      if(!data) return;

      var visitId = data.dataSet[tableName][0].LatestVisitId;
      this.openVisitDialog(visitId);
    },

    openVisitDialog: function(visitId){
      var panel = this.LoadOnDemandPanel;

      panel.set("isLoaded", false);
      panel.refresh();
      this.VisitDialog.show();
      panel.set("isBusy", true);

      panel.on("change:isLoaded", function () {
        panel.off("change:isLoaded");
        panel.set("isBusy", false);
        visitDialogApp.open(visitDialogApp, visitId);
      }, this);
    },
    
    isSkinnyMode: function()
    {
      var skinnyMode = cintelUtil.getQueryParam("skinnymode");

      if(skinnyMode != 1) return;
      $("header").remove();
      this.BackButton.set("isVisible", false);
      this.RefreshButton.viewModel.$el.addClass("skinnymode-refresh");
    }

  });
  return app;
});