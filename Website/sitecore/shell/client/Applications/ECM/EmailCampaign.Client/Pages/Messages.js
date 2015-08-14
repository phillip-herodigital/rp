define(["sitecore", "/-/speak/v1/ecm/PrimaryNavigation.js", "/-/speak/v1/ecm/Messages.js"], function (sitecore, primaryNavigation) {
  var messagesPage = sitecore.Definitions.App.extend({
    initialized: function () {
      //set up default navigation dialogs
      primaryNavigation.initializePrimaryNavigation(this);

      var contextApp = this;

      messages_InitializeDefaultSettingsDialog(contextApp, sitecore, sessionStorage.managerRootId);
      messages_InitializeAlertDialog(contextApp, sitecore);
      messages_InitializePromptDialog(contextApp, sitecore);
      messages_InitializeConfirmDialog(contextApp, sitecore);

      contextApp.SearchTextBox.viewModel.$el.on("keypress", function (event) {
        var text = contextApp.SearchTextBox.viewModel.$el.find("input").val();
        if (event.which == '13'/*Enter*/) {
          contextApp.MessageListDataSource.set("search", text);
        }
      });

      contextApp.SearchTextBox.viewModel.$el.on("keyup", function (event) {
        if (event.which == '27'/*Escape*/) {
          contextApp.cancelSearch(contextApp);
        }
      });

      contextApp.on("action:search", function () {
        contextApp.SearchTextBox.viewModel.$el.focus();
      }, contextApp);

      contextApp.on("action:reload", function () {
        ReloadDashboard();
      }, contextApp);

      contextApp.on("action:deletemessage", function () {
        deleteSelectedMessage(this.MessageListDataSource, this.MessageList.get("selectedItem"), this, sitecore);
      }, contextApp);

      contextApp.on("action:SearchItems", function () {
        var text = contextApp.SearchTextBox.viewModel.$el.find("input").val();
        contextApp.MessageListDataSource.set("search", text);
      }, contextApp);
      
      // TODO: Implement action:export
      contextApp.on("action:export", function (event) {
        if (contextApp.MessageList && sitecore.Pipelines.ExportToCSV && contextApp.MessageBar && contextApp.ProgressIndicator) {
          var selectedItem = contextApp.MessageList.get("selectedItem");
          var messageId = selectedItem.get("itemId"),
              messageName = selectedItem.get("name"),
              token = new Date().getTime();

          sitecore.Pipelines.ExportToCSV.execute(
            {
              app: contextApp,
              currentContext: {
                token: token,
                messageId: messageId,
                dataSourceItemId: "allrecipients",
                messageName: messageName,
                language: "0"
              },
              spinner: contextApp.ProgressIndicator,
              action: event.sender.model.viewModel
            });
        }
      }, contextApp);

      // TODO: Implement action:import
      contextApp.on("action:import", function () {
        alert("show exisitng import i.e. (/sitecore/shell/default.aspx?xmlcontrol=EmailCampaign.ImportUsersWizard&itemID={E164FD28-E95B-4F25-A063-61F7AA23FD8F})");
      }, contextApp);

      disableActions();

      this.MessageList.on("change:selectedItem", function () {
        var selectedItem = this.MessageList.get("selectedItem");
        if (selectedItem) {
          // Open Message action
          enableAction("CB6F4D17016A403992FE75E960229C92", true);
          // Delete Message action
          enableAction("0A7A4FB35335478E92A8CBA39F3A7986", true);
          // Enable export to CSV only for the sent messages
          if (selectedItem.get("sent") > 0) {
            // Export to CSV action
            enableAction("29A5E0FDFBD54242B0227E57DB12D9A6", true);
          }
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
        var actions = contextApp.ActionControl.attributes.actions;
        for (var i = 0 ; i < actions.length; i++) {
          if (actions[i].id() === actionId) {
            enable ? actions[i].enable() : actions[i].disable();
            break;
          }
        }
      };

      contextApp.on("action:open", function () {
        openSelectedMessage(this.MessageList);
      }, contextApp);

      messages_setTimezoneCookie();
      setSelectedNavigation();
      resizeSearchTextBox();
      listenToResizeWindow();

      function resizeSearchTextBox() {
        var $searchTextBox = contextApp.SearchTextBox.viewModel.$el;
        $searchTextBox.width($searchTextBox.parent().width() - 60);
      }

      function listenToResizeWindow() {
        $(window).resize(function () {
          resizeSearchTextBox();
        });
      }

      function setSelectedNavigation() {
        _.each($('div[data-sc-id="MessagesNavigationLinks"]').find('a'), setSelected);

        function setSelected(link) {
          if (link.href === window.location.href) {
            $(link).parent("li").addClass("selected");
          }
        }
      }
    },

  });

  return messagesPage;
});