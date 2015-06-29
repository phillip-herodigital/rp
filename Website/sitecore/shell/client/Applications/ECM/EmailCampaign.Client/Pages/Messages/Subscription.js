define(["sitecore",
  "/-/speak/v1/ecm/Messages.js",
  "/-/speak/v1/ecm/ActionControl.js",
  "/-/speak/v1/ecm/Language.js",
  "/-/speak/v1/ecm/Notifications.js",
  "/-/speak/v1/ecm/Validation.js"], function (sitecore, messages, actionControl, language, notifications) {
    var subscriptionMessagePage = sitecore.Definitions.App.extend({
      initialized: function () {

        var contextApp = this;
        contextApp.initErrorMessage(this.MessageContext, this.MessageBar);
        initActionControl(contextApp, this.MessageContext);
        language.initLanguage(contextApp);
        contextApp.initActions(this, this.MessageContext);
        contextApp.initButtons(contextApp);
        contextApp.initUnload(this.MessageContext);
        messages_ChangeManagerRoot(contextApp);
        messages_TabOnClick(sitecore, contextApp);

        messages_SetPreselectedTab(contextApp, sitecore);
        sitecore.on("mainApp", function (subapp) {
          subapp.MessageContext = contextApp.MessageContext;
          subapp.MessageBar = contextApp.MessageBar;
          subapp.AddVariant = contextApp.AddVariant;
          subapp.DuplicateVariant = contextApp.DuplicateVariant;
          subapp.RemoveVariant = contextApp.RemoveVariant;
          subapp.ReportUpdateWatcher = contextApp.ReportUpdateWatcher;

          sitecore.trigger("change:messageContext");
          contextApp.trigger("change:messageContext");
          subapp.trigger("change:messageContext");
        });

        sitecore.on("message:delivery:verifyMessage", function (actionName, isSchedule) {
          if (verifyMessage(sitecore, contextApp, "send", addCreatedEmptyList)) {
            sitecore.trigger("message:delivery:dispatch", actionName, isSchedule);
          }
        });

        sitecore.on("notify:recipientList:locked", function () {
          notifications.recipientListLocked(contextApp.MessageBar);
        });
      },

      initErrorMessage: function (messageContext, messageBar) {
        messages_NotFound(messageContext, sitecore, messageBar);
      },

      initUnload: function (messageContext) {
        messages_PromtWithoutSaving(messageContext, sitecore);
      },

      initButtons: function (contextApp) {
        messages_SaveBackButtons(sitecore, contextApp);
      },

      initActions: function (contextApp, messageContext) {
        if (!contextApp || !messageContext) { return; }
        messages_InitializeAddAttachmentDialog(contextApp, sitecore, messageContext);
        messages_InitializeSaveAsSubscriptionDialog(contextApp, sitecore, messageContext);
        messages_InitializeAlertDialog(contextApp, sitecore);
        messages_InitializePromptDialog(contextApp, sitecore);
        messages_InitializeConfirmDialog(contextApp, sitecore);

        contextApp.on("action:editengagementplan", function () {
          this.openEngagementPlan(true, contextApp.MessageBar);
        }, contextApp);

        sitecore.on("action:openengagementplan", function () {
          this.openEngagementPlan(false, contextApp.MessageBar);
        }, contextApp);

        contextApp.on("action:duplicatemessage", function () {
          var messageId = contextApp.MessageContext.get("messageId");
          var messageName = contextApp.MessageContext.get("messageName");

          copySelectedMessage(messageId, messageName, sitecore);
        }, contextApp);

        contextApp.on("action:opensitecoreappcenter", function () {
          this.openSitecoreAppCenter(contextApp.MessageBar);
        }, contextApp);

        // TODO: Implement action:import
        contextApp.on("action:import", function () {
          alert("show exisitng import i.e. (/sitecore/shell/default.aspx?xmlcontrol=EmailCampaign.ImportUsersWizard&itemID={E164FD28-E95B-4F25-A063-61F7AA23FD8F})");
        }, contextApp);

        // allows for tab switching, taking the state of a LoadOnDemandPanel into consideration
        sitecore.on("action:switchtab", function (args) {
          var tab = contextApp.TabControl.viewModel.$el.children("ul.sc-tabcontrol-navigation").find("a:eq(" + args.tab + ")");
          tab.click();

          if (args.subtab != "undefined") {
            var panels = GetLoadOnDemandPanels(contextApp);
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
        }, contextApp);
      },
      
      openEngagementPlan: function (editMode, messageBar) {
        if (!messageBar)
          return;

        var contextApp = this;
        var selectedGuid = contextApp.MessageContext.get("messageId");
        if (!selectedGuid || selectedGuid.length == 0)
          return;

        var context = { messageId: selectedGuid, editMode: editMode };

        postServerRequest("ecm.openengagementplan.geturl", context, function (response) {
          if (response.error) {
            messageBar.addMessage("error", response.errorMessage);
            return;
          }

          if (response.value) {
            window.open(response.value, "_blank");
          }
        });
      },

      openSitecoreAppCenter: function (messageBar) {
        if (!messageBar) {
          return;
        }

        postServerRequest("ecm.opensitecoreappcenter.geturl", {}, function (response) {
          if (response.error) {
            messageBar.addMessage("error", response.errorMessage);
            return;
          }

          if (response.value) {
            window.open(response.value, "_blank");
          }
        });
      },
    });
    return subscriptionMessagePage;
  });