define([
  "sitecore",
  "/-/speak/v1/ecm/constants.js",
  "/-/speak/v1/ecm/MessageBase.js",
  "/-/speak/v1/ecm/UrlService.js",
  "/-/speak/v1/ecm/MessageTabsHelper.js",
  "/-/speak/v1/ecm/GlobalValidationService.js",
  "/-/speak/v1/ecm/DialogService.js",
  "/-/speak/v1/ecm/ServerRequest.js",
  "/-/speak/v1/ecm/MessageValidationService.js",
  "/-/speak/v1/ecm/Notifications.js"
], function (
  sitecore,
  Constants,
  messageBase,
  urlService,
  MessageTabsHelper,
  GlobalValidationService,
  DialogService,
  ServerRequest,
  MessageValidationService,
  notifications
  ) {
  var messageCreation = messageBase.extend({
    initialized: function () {
      this._super();
      this.initUnload();
      this.initTabs();
      if (this.MessageContext.get("messageType") === "") {
        this.MessageContext.on("change:messageType", _.once(this.bindProgressIndicatorToLoadOnDemand), this);
      } else {
        this.bindProgressIndicatorToLoadOnDemand();
      }
      sitecore.on("change:messageContext", this.updateLanguageSwitcher, this);
    },

    initUnload: function () {
        window.onbeforeunload = _.bind(function () {
            if (this.MessageContext.get("isModified")) {
                return sitecore.Resources.Dictionary.translate("ECM.MessagePage.SaveBeforeLeaving");
            }
        }, this);
    },

    attachEventHandlers: function () {
      this._super();
      this.on("message:save", function (args) {
        GlobalValidationService.validateAll();
        if (GlobalValidationService.get('valid') && this.validateRecipients()) {
          var verified = this.verifyMessage("save", this.addCreatedEmptyList);
          args.Verified = verified;
          args.Saved = this.MessageContext.saveMessage();
        }
      }, this);
      sitecore.on({
          "message:delivery:verifyMessage": function(actionName, isSchedule) {
              if (this.verifyMessage("send", this.addCreatedEmptyList)) {
                  sitecore.trigger("message:delivery:dispatch", actionName, isSchedule);
              }
          },
          "mainApp": function (subapp) {
              this.extendSubapp(subapp);
              sitecore.trigger("change:messageContext");
              this.trigger("change:messageContext");
              subapp.trigger("change:messageContext");
          },
          "notify:recipientList:locked": function () {
              notifications.recipientListLocked(this.MessageBar);
          },
          "action:previewrecipients": function () {
              DialogService.show("previewRecipients", {
                  data: {
                      contextApp: this,
                      messageContext: this.MessageContext
                  }
              });
          }
      }, this);
    },

    extendSubapp: function (subapp) {
        _.extend(subapp, {
            MessageContext: this.MessageContext,
            MessageBar: this.MessageBar,
            AddVariant: this.AddVariant,
            DuplicateVariant: this.DuplicateVariant,
            RemoveVariant: this.RemoveVariant,
            ReportUpdateWatcher: this.ReportUpdateWatcher,
            AccountInformationExt: this.AccountInformationExt,
            LanguageSwitcher: this.LanguageSwitcher,
            SaveButton: this.SaveButton
        });
    },

    validateRecipients: function() {
      if (this.IncludedRecipientDataSource) {
        this.IncludedRecipientDataSource.viewModel.refresh();
      }
      if (this.ExcludedRecipientDataSource) {
        this.ExcludedRecipientDataSource.viewModel.refresh();
      }

      var context = {
        includedRecipientDataSource: this.IncludedRecipientDataSource,
        messageBar: this.MessageBar,
        errorCount: 0
      };

      sitecore.Pipelines.Validate.execute({ currentContext: context });
      if (context.errorCount > 0) {
        return false;
      }

      return true;
    },

    updateLanguageSwitcher: function () {
      var activeLanguages = this.LanguageSwitcher.viewModel.getActiveLanguages();
      if (this.MessageContext.get("messageState") !== Constants.MessageStates.DRAFT && activeLanguages.length > 1) {
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
    },

    refreshLists: function () {
      var messageId = this.MessageContext.get("messageId");
      if (this.IncludedRecipientDataSource) {
        this.IncludedRecipientDataSource.set("messageId", messageId);
        this.IncludedRecipientDataSource.viewModel.refresh();
      }
      if (this.ExcludedRecipientDataSource) {
        this.ExcludedRecipientDataSource.set("messageId", messageId);
        this.ExcludedRecipientDataSource.viewModel.refresh();
      }
    },

    verifyMessage: function (actionName, callback) {
      this.refreshLists();

      if (this.IncludedRecipientDataSource) {
        if (actionName === "send" && this.hasNoIncludedRecipients(this.MessageContext.get("messageType"))) {
          DialogService.show('alert', { text: this.StringDictionary.get("ECM.Pages.Message.ThereIsNoRecipient") });
          return false;
        }
      }

      if (actionName === "send" && !MessageValidationService.validateMessageVariantsSubject(this.MessageContext.get("variants"))) {
        return false;
      }

      if (this.MessageContext.get("messageType") === "Triggered") {
        return true;
      }

      if (actionName === "save" && this.hasNoAnyRecipients()) {
        return true;
      }

      if (this.IncludedRecipientDataSource || this.ExcludedRecipientDataSource) {
        var includedListsMessage = this.StringDictionary.get("ECM.Pages.Message.DefaultListsHaveNotBeenSpecifiedForThisMessage");
        var excludedListsMessage = this.StringDictionary.get("ECM.Pages.Message.ThereIsNoDefaultListAssignedForOptOut");

        var verifyIncluded = this.verifyLists(includedListsMessage, callback, this.IncludedRecipientDataSource);
        if (verifyIncluded) {
          return this.verifyLists(excludedListsMessage, callback, this.ExcludedRecipientDataSource);
        }
      }
      return false;
    },

    verifyLists: function (notification, callback, dataSource) {
      var recipientLists = dataSource.get("recipientLists");
      if (!recipientLists.length || !recipientLists[0].default) {
        DialogService.show('confirm', {
          text: notification,
          on: {
            ok: _.bind(function () {
              var recipientListType = dataSource.get("recipientListType");
              var sourceMessageId = dataSource.get("messageId");
              DialogService.show('addEmptyList', {
                on: {
                  ok: function (messageId, listId, listType) {
                    DialogService.remove('selectList');
                    callback(messageId, listId, listType);
                  }
                },
                data: {
                  messageId: sourceMessageId,
                  recipientListType: recipientListType
                },
                notify: false
              });
            }, this)
          }
        });
        return false;
      }
      return true;
    },

    hasNoIncludedRecipients: function (messageType) {
      if (messageType === "Triggered") {
        return false;
      }

      if (!this.IncludedRecipientDataSource) {
        return true;
      }
      var recipientLists = this.IncludedRecipientDataSource.get("recipientLists");

      for (var i = 0; i < recipientLists.length; i++) {
        if (recipientLists[i].recipients > 0) {
          return false;
        }
      }
      return true;
    },

    hasNoAnyRecipients: function () {
      if (!this.IncludedRecipientDataSource && !this.ExcludedRecipientDataSource) {
        return true;
      }

      return !this.IncludedRecipientDataSource.get("recipientLists").length > 0 &&
        !this.ExcludedRecipientDataSource.get("recipientLists").length > 0;
    },

    addCreatedEmptyList: function (messageId, listId, listType) {
        ServerRequest(Constants.ServerRequests.ADD_RECIPIENT_LIST, {
        data: { messageId: messageId, recipientListId: listId, type: listType },
        success: function (response) {
          if (response.error) {
            return;
          }
          sitecore.trigger("add:list", messageId, listId, listType, response);
        },
        async: false
      });
    }
  });

  return messageCreation;
});