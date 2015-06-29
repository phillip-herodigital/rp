require.config({
  paths: {
    experienceAnalytics: "/sitecore/shell/client/Applications/ExperienceAnalytics/Common/Layouts/Renderings/Shared/ExperienceAnalytics"
  }
});

define(["sitecore", "experienceAnalytics", "/-/speak/v1/ecm/PrimaryNavigation.js", "/-/speak/v1/ecm/Messages.js"], function (sitecore, ExperienceAnalytics, primaryNavigation) {
  var startPage = sitecore.Definitions.App.extend({
    initialized: function() {
      sitecore.on("chart:loaded", this.updateChart, this);

      //set up default navigation dialogs
      primaryNavigation.initializePrimaryNavigation(this, sitecore);

      var contextApp = this;

      messages_InitializeDefaultSettingsDialog(contextApp, sitecore, sessionStorage.managerRootId);

      contextApp.on("action:reload", function() {
        ReloadDashboard();
      }, contextApp);

      contextApp.on("action:deletemessage", function() {
        deleteSelectedMessage(this.MostRecentDispatchedMessagesDataSource, this.MostRecentDispatchedMessagesList.get("selectedItem"), this, sitecore);
      }, contextApp);

      // TODO: Implement action:export
      contextApp.on("action:export", function (event) {
        var selectedItem = contextApp.MostRecentDispatchedMessagesList.get("selectedItem");
        var messageId = selectedItem.get("itemId"),
            messageName = selectedItem.get("name"),
            token = new Date().getTime();

        sitecore.Pipelines.ExportToCSV.execute(
          {
            app: contextApp,
            currentContext: {
              token: token,
              messageId: messageId,
              messageBar: contextApp.MessageBar,
              dataSourceItemId: "allrecipients",
              messageName: messageName,
              language: "0"
            },
            spinner: contextApp.ProgressIndicator,
            action: event.sender.model.viewModel
          });
      }, contextApp);

      // TODO: Implement action:import
      contextApp.on("action:import", function() {
        alert("show exisitng import i.e. (/sitecore/shell/default.aspx?xmlcontrol=EmailCampaign.ImportUsersWizard&itemID={E164FD28-E95B-4F25-A063-61F7AA23FD8F})");
      }, contextApp);

      disableActions();
      
      this.MostRecentDispatchedMessagesList.on("change:selectedItem", function() {
        var selectedItem = this.MostRecentDispatchedMessagesList.get("selectedItem");
        if (selectedItem) {
          // Open Message action
          enableAction("CB6F4D17016A403992FE75E960229C92", true);
          // Delete Message action
          enableAction("0A7A4FB35335478E92A8CBA39F3A7986", true);
          // Export to CSV action
          enableAction("29A5E0FDFBD54242B0227E57DB12D9A6", true);
        } else {
          disableActions();
        }

      }, this);

      function disableActions() {
        // Open Message action
        enableAction("CB6F4D17016A403992FE75E960229C92", false);
        // Delete Message action
        enableAction("0A7A4FB35335478E92A8CBA39F3A7986", false);
        // Export to CSV action
        enableAction("29A5E0FDFBD54242B0227E57DB12D9A6", false);
      }

      function enableAction(actionId, enable) {
        var actions = contextApp.MostRecentDispatchedMessagesActionControl.attributes.actions;
        for (var i = 0 ; i < actions.length; i++) {
          if (actions[i].id() === actionId) {
            enable ? actions[i].enable() : actions[i].disable();
            break;
          }
        }
      };

      contextApp.on("action:open", function() {
        openSelectedMessage(this.MostRecentDispatchedMessagesList);
      }, contextApp);

      if (this.EmailChannelPerformanceApp) {
        this.EmailChannelPerformanceApp.viewModel.$el.onclick = function() {
          showEmailChannelPerformanceDialog(contextApp);
        };
      }

      messages_setTimezoneCookie();
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
    }
    
  });

  return startPage;
});

function showEmailChannelPerformanceDialog(contextApp) {
  if (contextApp["emailChannelPerformanceDialog"] === undefined) {
    contextApp.insertRendering("{83EF8494-5D10-4CF7-9F8C-A517E9CC6818}", { $el: $("body") }, function(subApp) {
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