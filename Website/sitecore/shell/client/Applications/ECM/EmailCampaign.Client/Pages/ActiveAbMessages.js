define(["sitecore", "/-/speak/v1/ecm/PrimaryNavigation.js", "/-/speak/v1/ecm/Messages.js"], function(sitecore, primaryNavigation) {
  var activeAbMessagesPage = sitecore.Definitions.App.extend({
    initialized: function() {
      //set up default navigation dialogs
      primaryNavigation.initializePrimaryNavigation(this);

      var contextApp = this;

      messages_InitializeDefaultSettingsDialog(contextApp, sitecore, sessionStorage.managerRootId);

      contextApp.SearchTextBox.viewModel.$el.on("input", function() {
        var text = contextApp.SearchTextBox.viewModel.$el.val();
        if (text != "") {
          contextApp.SearchButton.set("isVisible", false);
          contextApp.CancelSearchButton.set("isVisible", true);
        } else {
          contextApp.SearchButton.set("isVisible", true);
          contextApp.CancelSearchButton.set("isVisible", false);
        }
      });

      contextApp.SearchTextBox.viewModel.$el.on("keypress", function(event) {
        var text = contextApp.SearchTextBox.viewModel.$el.val();
        if (event.which == '13'/*Enter*/) {
          contextApp.MessageListDataSource.set("search", text);
        }
      });

      contextApp.SearchTextBox.viewModel.$el.on("keyup", function(event) {
        if (event.which == '27'/*Escape*/) {
          contextApp.cancelSearch(contextApp);
        }
      });

      contextApp.on("action:search", function() {
        contextApp.SearchTextBox.viewModel.$el.focus();
      }, contextApp);

      contextApp.on("action:cancelSearch", function() {
        contextApp.cancelSearch(contextApp);
      }, contextApp);

      contextApp.on("action:deletemessage", function() {
        deleteSelectedMessage(this.MessageListDataSource, this.MessageList.get("selectedItem"), this, sitecore);
      }, contextApp);

      // TODO: Implement action:export
      contextApp.on("action:export", function(event) {
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
                messageBar: contextApp.MessageBar,
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
      contextApp.on("action:import", function() {
        alert("place holder - action:import");
      }, contextApp);

      contextApp.on("action:open", function() {
        openSelectedMessage(this.MessageList);
      }, contextApp);
      
      disableActions();

      this.MessageList.on("change:selectedItem", function() {
        var selectedItem = this.MessageList.get("selectedItem");
        if (selectedItem) {
          // Open Message action
          enableAction("CB6F4D17016A403992FE75E960229C92", true);
          
          this.SelectedMessagePanel.set("isOpen", true);
          
          // Enable export to CSV only for the sent messages
          if (selectedItem.get("sent") > 0) {
            // Export to CSV action
            enableAction("29A5E0FDFBD54242B0227E57DB12D9A6", true);
          }
          this.MessageVariantList.set("items", selectedItem.get("variants"));
        } else {
          disableActions();
          
          this.SelectedMessagePanel.set("isOpen", false);
        }

      }, this);
      
      function disableActions() {
        // Open Message action
        enableAction("CB6F4D17016A403992FE75E960229C92", false);
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
      
      this.Accordion.on("change:isOpen", function() {
        var isOpen = contextApp.Accordion.get("isOpen");
        contextApp.ShowMoreButton.set("isVisible", isOpen);
      }, this);

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
        _.each($('div[data-sc-id="ReportsNavigationLinks"]').find('a'), setSelected);

        function setSelected(link) {
          if (link.href === window.location.href) {
            $(link).parent("li").addClass("selected");
          }
        }
      }
    },

    cancelSearch: function(contextApp) {
      contextApp.SearchButton.set("isVisible", true);
      contextApp.CancelSearchButton.set("isVisible", false);

      contextApp.SearchTextBox.viewModel.$el.val("");
      contextApp.MessageListDataSource.set("search", "");
    }

  });
  
  return activeAbMessagesPage;
});