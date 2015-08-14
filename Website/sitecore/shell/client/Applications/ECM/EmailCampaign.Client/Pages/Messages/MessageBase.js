define([
  "sitecore",
  "/-/speak/v1/ecm/AppBase.js",
  "/-/speak/v1/ecm/Messages.js",
  "/-/speak/v1/ecm/ActionControl.js",
  "/-/speak/v1/ecm/Language.js",
  "/-/speak/v1/ecm/Notifications.js",
  "/-/speak/v1/ecm/Validation.js"
], function (sitecore, appBase, messages, actionControl, language, notifications) {
  var messageBase = appBase.extend({
    initialized: function () {
      this.initErrorMessage();
       
      initActionControl(this, this.MessageContext);

      this.initDialogs();
      this.initActions(this, this.MessageContext);
      this.initButtons();
      this.initUnload();
      this.attachEventHandlers();

      language.initLanguage(this);
      messages_ChangeManagerRoot(this);
    },

    attachEventHandlers: function () {
      sitecore.on({
        "mainApp": function (subapp) {
          this.extendSubapp(subapp);
          sitecore.trigger("change:messageContext");
          this.trigger("change:messageContext");
          subapp.trigger("change:messageContext");
        },
        "message:delivery:verifyMessage": function (actionName, isSchedule) {
          if (verifyMessage(sitecore, this, "send", addCreatedEmptyList)) {
            sitecore.trigger("message:delivery:dispatch", actionName, isSchedule);
          }
        },
        "notify:recipientList:locked": function () {
          notifications.recipientListLocked(this.MessageBar);
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
        LanguageSwitcher: this.LanguageSwitcher
      });
    },

    initErrorMessage: function () {
      messages_NotFound(this.MessageContext, sitecore, this.MessageBar);
    },

    initUnload: function () {
      messages_PromtWithoutSaving(this.MessageContext, sitecore);
    },

    initButtons: function () {
      messages_SaveBackButtons(sitecore, this);
    },

    initDialogs: function() {
      messages_InitializeAddAttachmentDialog(this, sitecore, this.MessageContext);
      messages_InitializeSaveAsSubscriptionDialog(this, sitecore, this.MessageContext);
      messages_InitializeAttachmentsDialog(this, sitecore, this.MessageContext, true);
      messages_InitializePreviewRecipientsDialog(this, sitecore, this.MessageContext, true);
      messages_InitializeAlertDialog(this, sitecore);
      messages_InitializePromptDialog(this, sitecore);
      messages_InitializeConfirmDialog(this, sitecore);
    },

    initActions: function () {
      if (!this.MessageContext) { return; }

      this.on({
        "action:editengagementplan": function () {
          this.openEngagementPlan(true);
        },
        "action:duplicatemessage": function () {
          var messageId = this.MessageContext.get("messageId");
          var messageName = this.MessageContext.get("messageName");

          copySelectedMessage(messageId, messageName, sitecore);
        },
        "action:opensitecoreappcenter": function () {
          this.openSitecoreAppCenter();
        },
        // TODO: Implement action:import
        "action:import": function () {
          alert("show exisitng import i.e. (/sitecore/shell/default.aspx?xmlcontrol=EmailCampaign.ImportUsersWizard&itemID={E164FD28-E95B-4F25-A063-61F7AA23FD8F})");
        }
      }, this);

      sitecore.on("action:openengagementplan", function () {
        this.openEngagementPlan(false);
      }, this);
    },

    getMessageReportUrlKey: function() {
      return "Messages" + this.MessageContext.get("messageType");
    },

    getMessageUrlParams: function() {
      return {
        id: this.MessageContext.get("messageId"),
        sc_speakcontentlang: this.MessageContext.get("language")
      };
    },

    switchToMessage: function () {
      var urlParams = {
        id: this.MessageContext.get("messageId"),
        sc_speakcontentlang: this.MessageContext.get("language")
      };

      var messagePath = urlService.getUrl(this.getMessageReportUrlKey(), urlParams);
      location.href = messagePath;
    },

    openEngagementPlan: function (editMode) {
      if (!this.MessageBar)
        return;

      var selectedGuid = this.MessageContext.get("messageId");
      if (!selectedGuid || selectedGuid.length == 0) {
        return;
      }

      var context = { messageId: selectedGuid, editMode: editMode };

      postServerRequest("EXM/EngagementPlanUrl", context, _.bind(function (response) {
        if (response.error) {
          this.MessageBar.addMessage("error", response.errorMessage);
          return;
        }

        if (response.value) {
          window.open(response.value, "_blank");
        }
      }, this));
    },

    openSitecoreAppCenter: function () {
      if (!this.MessageBar) {
        return;
      }

      postServerRequest("EXM/AppCenterUrl", {}, function (response) {
        if (response.error) {
          this.MessageBar.addMessage("error", response.errorMessage);
          return;
        }

        if (response.value) {
          window.open(response.value, "_blank");
        }
      });
    }
  });

  return messageBase;
});