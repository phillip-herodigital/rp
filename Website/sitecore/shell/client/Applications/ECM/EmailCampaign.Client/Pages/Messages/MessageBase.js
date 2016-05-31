define([
  "sitecore",
  "/-/speak/v1/ecm/PageBase.js",
  "/-/speak/v1/ecm/Language.js",
  "/-/speak/v1/ecm/MessageHelper.js",
  "/-/speak/v1/ecm/ServerRequest.js",
  "/-/speak/v1/ecm/DialogService.js",
  "/-/speak/v1/ecm/Notifications.js"
], function (
  sitecore,
  PageBase,
  language,
  MessageHelper,
  ServerRequest,
  DialogService,
  notifications) {
  var messageBase = PageBase.extend({
    messageActionIds: {
      saveAsSubscribtion: '0661D49FE0204040A255705AA20F67FA',
      engagementPlan: '34BE63852A2C4AC6BB3A9F35C3280564'
    },
    

    initialized: function () {
      this._super();
      this.initErrorMessage();

      this.initActions(this, this.MessageContext);
      this.initButtons();
      this.initUnload();
      this.attachEventHandlers();

      language.initLanguage(this);
      MessageHelper.changeManagerRoot(this);
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
          if (MessageHelper.verifyMessage(sitecore, this, "send", MessageHelper.addCreatedEmptyList)) {
            sitecore.trigger("message:delivery:dispatch", actionName, isSchedule);
          }
        },
        "notify:recipientList:locked": function () {
          notifications.recipientListLocked(this.MessageBar);
        },
        "action:previewrecipients": function () {
          DialogService.show("previewRecipients", {
            contextApp: this,
            messageContext: this.MessageContext
          });
        },
        "action:showattachments": function () {
          DialogService.show("attachments", {
            contextApp: this,
            messageContext: this.MessageContext
          });
        },
        "change:messageContext": this.toggleSaveAsSubscribtionAction
      }, this);

      this.MessageContext.on({
        "change:isBusy": this.toggleEngagementPlanAction,
        "change:isReadonly": this.toggleEngagementPlanAction
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
      MessageHelper.notFound(this.MessageContext, sitecore, this.MessageBar);
    },

    initUnload: function () {
      MessageHelper.promtWithoutSaving(this.MessageContext, sitecore);
    },

    initButtons: function () {
      MessageHelper.saveBackButtons(sitecore, this);
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

          MessageHelper.copySelectedMessage(this.MessageContext);
        },
        "action:opensitecoreappcenter": function () {
          this.openSitecoreAppCenter();
        },
        "action:saveassubscription": this.onSaveAsSubscribtion,
        // TODO: Implement action:import
        "action:import": function () {
          alert("show exisitng import i.e. (/sitecore/shell/default.aspx?xmlcontrol=EmailCampaign.ImportUsersWizard&itemID={E164FD28-E95B-4F25-A063-61F7AA23FD8F})");
        }
      }, this);

      sitecore.on({
        "action:openengagementplan": function () {
          this.openEngagementPlan(false);
        },
        "action:addattachment": function () {
          DialogService.show("addAttachment", {
            messageId: this.MessageContext.get("messageId"),
            language: this.MessageContext.get("language")
          });
        },
        "attachment:file:added": function () {
          this.MessageContext.viewModel.refresh();
        },
        "attachment:file:removed": function () {
          this.MessageContext.viewModel.refresh();
        }
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
    },

    toggleEngagementPlanAction: function() {
      // Only react on the event if MessageContext is not busy loading.
      var isReadOnly = this.MessageContext.get("isReadonly");

      if (this.MessageContext.get("isBusy") === false) {
        _.each(this.ActionControl.get("actions"), _.bind(function(action) {
          if (action.id() === this.messageActionIds.engagementPlan) {
            if (isReadOnly === false) {
              action.enable();
            } else {
              action.disable();
            }
          }
        }, this));
      }
    },

    toggleSaveAsSubscribtionAction: function() {
      var saveAsSubscriptionAction = $('li[data-sc-actionid="' + this.messageActionIds.saveAsSubscribtion + '"]');
      if (this.MessageContext.get("messageType") === "OneTime") {
        saveAsSubscriptionAction.show();
      } else {
        saveAsSubscriptionAction.hide();
      }
    },

    onSaveAsSubscribtion: function() {
      ServerRequest("EXM/CanSaveSubscriptionTemplate", {
        success: function (response) {
          var errorMessageId = "error.ecm.saveassubscriptiontemplate.execute";
          this.MessageBar.removeMessage(function (error) {
            return error.id === errorMessageId;
          });
          if (response.error) {
            this.MessageBar.addMessage("error", { id: errorMessageId, text: response.errorMessage, actions: [], closable: true });
            return;
          }
          DialogService.show('saveAsSubscription', {
            contextApp: this,
            messageContext: this.MessageContext
          });
        },
        context: this,
        async: false
      });
    }
  });

  return messageBase;
});