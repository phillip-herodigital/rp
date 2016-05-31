define([
  "sitecore"
], function (sitecore) {
  var TabsHelper = {
    getSelectedTab: function() {
      var parameters = function() {
        var vars = [],
          hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split('=');
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
        }
        return vars;
      }

      return parameters()["selectedtab"];
    },

    tabOnClick: function (sitecore, contextApp) {
      // sets currentTabId in MessageContext and binds event onClick foreach tabs to Main TabControl 
      var tabControl = contextApp.TabControl;

      tabControl.viewModel.$el.children("ul.sc-tabcontrol-navigation").find("a").on("click", function() {
        setTimeout(function() {
          TabsHelper.ActivatePanel(contextApp, sitecore);
        }, 10);
      });
    },

    setPreselectedTab: function (contextApp, sitecore) {
      var selectedTab = TabsHelper.getSelectedTab();

      if (selectedTab) {
        window.setTimeout(function() {
          var tab = contextApp.TabControl.viewModel.tabs()[selectedTab];
          if (tab) {
            var foundTab = contextApp.TabControl.viewModel.$el.find('[data-tab-id="' + tab + '"]');
            if (foundTab) {
              foundTab.click();
            }
          }

          if (contextApp.MessageContext.get("isBusy")) {
            contextApp.MessageContext.once("change:isBusy",
              function() {
                TabsHelper.ActivatePanel(contextApp, sitecore, selectedTab);
              }
            );
          } else {
            TabsHelper.ActivatePanel(contextApp, sitecore, selectedTab);
          }
        }, 10);
      }
    },

    ActivatePanel: function (contextApp, sitecore, selectedTab) {
      var tabControl = contextApp.TabControl;
      var currentTabId = tabControl.get("selectedTab");

      var panels = TabsHelper.GetLoadOnDemandPanels(contextApp);

      _.each(panels, function (f) {
        if (f.get("isVisible")) {
          f.set("isVisible", false);
        }
      });

      var panel;
      if (selectedTab && panels[selectedTab]) {
        panel = TabsHelper.LoadOrActivatePanel(panels[selectedTab]);
      } else {
        panel = TabsHelper.LoadOrActivatePanel(panels[tabControl.get("selectedTabIndex")]);
      }

      sitecore.trigger("mainApp", contextApp);

      contextApp.MessageContext.set("currentTabId", currentTabId);

      return panel;
    },

    LoadOrActivatePanel: function (panel) {
      if (!panel.get("isLoaded")) {
        panel.refresh();
      }

      panel.set("isVisible", true);

      return panel;
    },

    GetLoadOnDemandPanels: function (contextApp) {
      if (contextApp.MessageContext.get("messageType") === "Triggered") {
        return [
          contextApp.GeneralTabLoadOnDemandPanel,
          contextApp.MessageTabLoadOnDemandPanel,
          contextApp.ReviewTabLoadOnDemandPanel,
          contextApp.DeliveryTabLoadOnDemandPanel
        ];
      }

      return [
        contextApp.GeneralTabLoadOnDemandPanel,
        contextApp.RecipientTabLoadOnDemandPanel,
        contextApp.MessageTabLoadOnDemandPanel,
        contextApp.ReviewTabLoadOnDemandPanel,
        contextApp.DeliveryTabLoadOnDemandPanel
      ];
    }
  };
  return TabsHelper;
});