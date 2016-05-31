define([
  "sitecore",
  "/-/speak/v1/ecm/MessageBase.js",
  "/-/speak/v1/ecm/UrlService.js",
  "/-/speak/v1/ecm/MessageTabsHelper.js",
  "/-/speak/v1/ecm/MessageHelper.js"
], function (
  sitecore,
  messageBase,
  urlService,
  MessageTabsHelper,
  MessageHelper
  ) {
  var messageCreation = messageBase.extend({
    initialized: function () {
      this._super();
      this.initTabs();
      if (this.MessageContext.get("messageType") === "") {
        this.MessageContext.on("change:messageType", _.once(this.bindProgressIndicatorToLoadOnDemand), this);
      } else {
        this.bindProgressIndicatorToLoadOnDemand();
      }
      sitecore.on("change:messageContext", this.updateLanguageSwitcher, this);
    },

    updateLanguageSwitcher: function () {
      var activeLanguages = this.LanguageSwitcher.viewModel.getActiveLanguages();
      if (this.MessageContext.get("messageState") !== MessageHelper.MessageStates.DRAFT && activeLanguages.length > 1) {
        this.LanguageSwitcher.viewModel.hideAllLanguagesItem();
      }
    },

    bindProgressIndicatorToLoadOnDemand: function() {
      var loadOnDemandPanels = MessageTabsHelper.GetLoadOnDemandPanels(this);
      sitecore.on('ajax:error', function () {
        this.PageProgressIndicator.set("isBusy", false);
      }, this);

      /*
       * Since LoadOnDemandPanel component doesn't trigger any "before load" events,
       *  the only workaround is listen for switching between tabs
       */ 
      this.TabControl.on("change:selectedTab", function () {
        var tabIndex = _.indexOf(this.TabControl.get("tabs"), this.TabControl.get("selectedTab"));
        var currentLoadOnDemandPanel = loadOnDemandPanels[tabIndex];
        if (!currentLoadOnDemandPanel.get("isLoaded")) {
          this.PageProgressIndicator.set("isBusy", true);
        }
      }, this);

      _.each(loadOnDemandPanels, _.bind(function(panel) {
        if (panel) {
          panel.on("change:isLoaded", function () {
            if (this.PageProgressIndicator) {
              this.PageProgressIndicator.set("isBusy", !panel.get("isLoaded"));
            }
          }, this);
        }
      }, this));
    },

    initTabs: function() {
      MessageTabsHelper.tabOnClick(sitecore, this);
      MessageTabsHelper.setPreselectedTab(this, sitecore);
      sitecore.on({ "action:switchtab": this.onSwitchTab }, this);
    },

    // allows for tab switching, taking the state of a LoadOnDemandPanel into consideration
    onSwitchTab: function (args) {
      var tab = this.TabControl.viewModel.$el.children("ul.sc-tabcontrol-navigation").find("a:eq(" + args.tab + ")");
      tab.click();

      if (args.subtab != "undefined") {
        var panels = MessageTabsHelper.GetLoadOnDemandPanels(this);
        var panel = panels[args.tab];
        if (!panel) {
          return;
        }

        if (panel.get("isLoaded")) {
          panel.viewModel.$el.find("ul.sc-tabcontrol-navigation").find("li:eq(" + args.subtab + ")").click();
        } else {
          panel.on("change:isLoaded", function () {
            panel.viewModel.$el.find("ul.sc-tabcontrol-navigation").find("li:eq(" + args.subtab + ")").click();
          });
        }
      }
    },

    initActions: function () {
      this._super();
      this.on("switch:to:report", this.switchToReport, this);
      sitecore.on("switch:to:report", this.switchToReport, this);
    },

    switchToReport: function () {
      var urlParams = this.getMessageUrlParams();
      var reportPath = urlService.getUrl("MessageReport", urlParams);
      location.href = reportPath;
    }
  });

  return messageCreation;
});