require.config({
  paths: {
    experienceAnalytics: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalytics"
  }
});

define(["sitecore", "experienceAnalytics", "/-/speak/v1/ecm/PrimaryNavigation.js", "/-/speak/v1/ecm/Messages.js"], function (sitecore, ExperienceAnalytics, primaryNavigation) {
  var startPage = sitecore.Definitions.App.extend({
    initialized: function () {
      this.attachEventHandlers();
      this.setupDialogs();
      this.initMessageListsActions();

      if (this.EmailChannelPerformanceApp) {
        this.EmailChannelPerformanceApp.viewModel.$el.onclick = function () {
          showEmailChannelPerformanceDialog(contextApp);
        };
      }

      messages_setTimezoneCookie();
    },

    attachEventHandlers: function () {
      sitecore.on("chart:loaded", this.updateChart, this);
      this.EmailManagerRoot.on("change:managerRootId", this.updateChart, this);
      this.on({
        "action:reload": (window.ReloadDashboard || $.noop),
        "action:deletemessage": function () {
          deleteSelectedMessage(this.MostRecentDispatchedMessagesDataSource, this.MostRecentDispatchedMessagesList.get("selectedItem"), this, sitecore);
        },
        "action:startpage:deletemessage": function () {
          deleteSelectedMessage(this.MessageListDataSource, this.MessageList.get("selectedItem"), this, sitecore);
        },
        "action:export": function () {
          var selectedItem = this.MostRecentDispatchedMessagesList.get("selectedItem");
          this.exportMessageRecipients(selectedItem, this.MostRecentDispatchedMessagesActionControl);
        },
        "action:startpage:export": function () {
          var selectedItem = this.MessageList.get("selectedItem");
          this.exportMessageRecipients(selectedItem, this.ActionControl);
        },
        "action:import": function () {
          alert("show exisitng import i.e. (/sitecore/shell/default.aspx?xmlcontrol=EmailCampaign.ImportUsersWizard&itemID={E164FD28-E95B-4F25-A063-61F7AA23FD8F})");
        },
        "action:open": function () {
          openSelectedMessage(this.MostRecentDispatchedMessagesList);
        },
        "action:startpage:open": function () {
          openSelectedMessage(this.MessageList);
        }
      }, this);

      this.MostRecentDispatchedMessagesList.on("change:selectedItem", function () {
        this.onMessageListSelectedItemChange(this.MostRecentDispatchedMessagesList.get("selectedItem"),
          this.MostRecentDispatchedMessagesActionControl.get("actions"));
      }, this);

      this.MessageList.on("change:selectedItem", function () {
        this.onMessageListSelectedItemChange(this.MessageList.get("selectedItem"), this.ActionControl.get("actions"));
      }, this);
    },

    setupDialogs: function () {
      //set up default navigation dialogs
      primaryNavigation.initializePrimaryNavigation(this, sitecore);

      messages_InitializeDefaultSettingsDialog(this, sitecore, sessionStorage.managerRootId);
      messages_InitializeAlertDialog(this, sitecore);
      messages_InitializePromptDialog(this, sitecore);
      messages_InitializeConfirmDialog(this, sitecore);
    },

    initMessageListsActions: function () {
      var actions = this.ActionControl.get("actions").add(this.MostRecentDispatchedMessagesActionControl.get("actions"));
      _.each(actions, function (action) {
        action.disable();
      });
    },

    onMessageListSelectedItemChange: function (selectedItem, actions) {
      _.each(actions, function (action) {
        selectedItem ? action.enable() : action.disable();
      });
    },

    exportMessageRecipients: function(selectedItem, actionControl) {
      var messageId = selectedItem.get("itemId"),
       messageName = selectedItem.get("name"),
        token = new Date().getTime();

      sitecore.Pipelines.ExportToCSV.execute(
        {
          app: this,
          currentContext: {
            token: token,
            messageId: messageId,
            dataSourceItemId: "allrecipients",
            messageName: messageName,
            language: "0"
          },
          spinner: this.ProgressIndicator,
          action: actionControl.viewModel
        });
    },

    updateChart: function () {
      var startDate = new Date(),
      endDate = new Date(),
      formattedStartDate,
      formattedEndDate;

      startDate.setDate(startDate.getDate() - 27);

      formattedStartDate = ExperienceAnalytics.reConvertDateFormat($.datepicker.formatDate("dd-mm-yy", startDate));
      formattedEndDate = ExperienceAnalytics.reConvertDateFormat($.datepicker.formatDate("dd-mm-yy", endDate));

      ExperienceAnalytics.setDateRange(formattedStartDate, formattedEndDate);

      //Uncomment after the http://tfs4dk1.dk.sitecore.net/tfs/PD-Products-01/Products/_workitems#_a=edit&id=38553 will be fixed
      //var managerRootId = sessionStorage.managerRootId,
      //contextApp = this;

      //if (!sessionStorage.managerRootId || sessionStorage.managerRootId == "null" || sessionStorage.managerRootId.length === 0) {
      //  return;
      //}

      //postServerRequest("EXM/EmailChannelPerformanceReportKey", { 'managerRootId': managerRootId }, function (response) {
      //  var startDate = new Date(),
      //  endDate = new Date(),
      //  formattedStartDate,
      //  formattedEndDate;

      //  var chart = contextApp.EmailChannelPerformance.EmailChannelPerformance;

      //  startDate.setDate(startDate.getDate() - 27);

      //  formattedStartDate = ExperienceAnalytics.reConvertDateFormat($.datepicker.formatDate("dd-mm-yy", startDate));
      //  formattedEndDate = ExperienceAnalytics.reConvertDateFormat($.datepicker.formatDate("dd-mm-yy", endDate));

      //  chart.set("keys", response.value);

      //  ExperienceAnalytics.setDateRange(formattedStartDate, formattedEndDate);


      //  var dateRange = ExperienceAnalytics.getDateRange(),
      //     parameters = sitecore.Helpers.url.getQueryParameters(chart.get("keysByMetricQuery"));

      //  parameters.dateFrom = ExperienceAnalytics.convertDateFormat(dateRange.dateFrom);
      //  parameters.dateTo = ExperienceAnalytics.convertDateFormat(dateRange.dateTo);
      //  parameters.keyGrouping = chart.get("keyGrouping");

      //  chart.viewModel.getData(parameters, ExperienceAnalytics.getSubsite(), chart.get("timeResolution"));
      //});
    }
  });

  return startPage;
});

function showEmailChannelPerformanceDialog(contextApp) {
  if (contextApp["emailChannelPerformanceDialog"] === undefined) {
    contextApp.insertRendering("{83EF8494-5D10-4CF7-9F8C-A517E9CC6818}", { $el: $("body") }, function (subApp) {
      contextApp["emailChannelPerformanceDialog"] = subApp;
      showEmailChannelPerformanceDialog();
    });
  } else {
    showEmailChannelPerformanceDialog();
  }

  function showEmailChannelPerformanceDialog() {
    if (contextApp.emailChannelPerformanceDialog.showDialog) {
      contextApp.emailChannelPerformanceDialog.showDialog();
    }
  }

}