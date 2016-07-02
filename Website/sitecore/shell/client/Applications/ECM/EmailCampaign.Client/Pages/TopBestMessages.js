define(["sitecore", "/-/speak/v1/ecm/PrimaryNavigation.js", "/-/speak/v1/ecm/Messages.js"], function (sitecore, primaryNavigation) {
  var topBestMessagesPage = sitecore.Definitions.App.extend({
    initialized: function() {
      //set up default navigation dialogs
      primaryNavigation.initializePrimaryNavigation(this, sitecore);

      var contextApp = this;
      
      messages_InitializeDefaultSettingsDialog(contextApp, sitecore, sessionStorage.managerRootId);
      messages_InitializePromptDialog(contextApp, sitecore);

      contextApp.on("action:open", function() {
        openSelectedMessage(this.MessageList);
      }, contextApp);

      contextApp.on("action:copytodraft", function() {
        if (!this.MessageList) {
          return;
        }

        var selectedItem = this.MessageList.get("selectedItem");
        if (!selectedItem) {
          return;
        }

        copySelectedMessage(selectedItem.get("itemId"), selectedItem.get("name"), sitecore);
      }, contextApp);

      this.MessageList.on("change:selectedItem", function() {
        var selectedItem = this.MessageList.get("selectedItem");
        if (selectedItem) {
          // Open Message action
          enableAction("97E64018304F4019B00188E99BF3805E", true);
          
          this.SelectedMessagePanel.set("isOpen", true);

          this.TotalRecipientsValue.set("text", selectedItem.get("totalRecipients"));
          this.ActualRecipientsValue.set("text", selectedItem.get("actualRecipients"));
          this.OpenedValue.set("text", selectedItem.get("opened"));
          this.ClickedValue.set("text", selectedItem.get("clicked"));
          this.BrowsedValue.set("text", selectedItem.get("browsed"));
          this.ProductiveValue.set("text", selectedItem.get("productive"));

          this.ValueValue.set("text", selectedItem.get("value"));
          this.ValuePerEmailValue.set("text", selectedItem.get("valuePerEmail").toFixed(1));
          this.ValuePerVisitValue.set("text", selectedItem.get("valuePerVisit").toFixed(1));
          this.VisitsPerEmailValue.set("text", selectedItem.get("visitsPerEmail").toFixed(1));
        } else {
          // Open Message action
          enableAction("97E64018304F4019B00188E99BF3805E", false);
          
          this.SelectedMessagePanel.set("isOpen", false);
        }
      }, this);

      messages_setTimezoneCookie();
      setSelectedNavigation();
      
      function enableAction(actionId, enable) {
        var actions = contextApp.ActionControl.attributes.actions;
        for (var i = 0 ; i < actions.length; i++) {
          if (actions[i].id() === actionId) {
            enable ? actions[i].enable() : actions[i].disable();
            break;
          }
        }
      };
      
      function setSelectedNavigation() {
        _.each($('div[data-sc-id="ReportsNavigationLinks"]').find('a'), setSelected);

        function setSelected(link) {
          if (link.href === window.location.href) {
            $(link).parent("li").addClass("selected");
          }
        }
      }
    }
    
  });

  return topBestMessagesPage;
});   