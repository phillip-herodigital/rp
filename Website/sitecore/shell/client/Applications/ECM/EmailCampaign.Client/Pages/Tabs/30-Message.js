define([
  "sitecore",
  "/-/speak/v1/ecm/Validation.js",
  "/-/speak/v1/ecm/AddVariant.Execute.js",
  "/-/speak/v1/ecm/RemoveVariant.Execute.js",
  "/-/speak/v1/ecm/DuplicateVariant.Execute.js",
  "/-/speak/v1/ecm/MessageTokenService.js"
], function (
  sitecore,
  Validation,
  AddVariant,
  RemoveVariant,
  DuplicateVariant,
  MessageTokenService) {

  function initMessageVariantContentEditorDialog(contextApp, variantContext, hideCallback) {
    if (contextApp["messageVariantContentEditorDialog"] === undefined) {
      contextApp.insertRendering("{8B5A7135-0135-4944-A69F-23D9CD388FE6}", { $el: $("body") }, function (subApp) {
        contextApp["messageVariantContentEditorDialog"] = subApp;
        messageVariantContentEditorDialogShow();
      });
    } else {
      messageVariantContentEditorDialogShow();
    }

    function messageVariantContentEditorDialogShow() {
      sitecore.trigger("message:variant:content:editor:dialog:show", variantContext, hideCallback);
    }
  }

  var messageTab = sitecore.Definitions.App.extend({
    // Actions have only one identificator is - item id. That is why it's hard to avoid hardcoded ids.
    // To make code more readable better to provide mapping for ids.
    variantActionsMap: {
      "50FC3020046340B29C2FAE24A72405F3": "remove",
      "7C0E88DAF11342309964C58A17D063FC": "duplicate",
      "CCC747CBA58C4574853E8E76EB74DF75": "abTestingResults",
      "3BAC2573525848FB88318BD61F67BBA6": "add",
      "4C0D998D2E5743B39401002642AA93F2": "insertToken",
      "79311FAE1A9944A88DC0F71BCB014DC7": "editBody",
      "6C408347BF6247679B054DD98D130555": "sendQuickTest",
      "61120EDF93734216BBF8FC47D8CC6300": "previewRecipient"
    },

    initialized: function () {
      sitecore.trigger("mainApp", this);

      this.isAbTesting = this.MessageContext.get("isAbTesting");
      this.isSubscriptionFromHTML = this.MessageContext.get("messageType") === "Subscription" && this.MessageContext.get("templateName") === "From HTML subscription";     
      this.isExistingPageTemplate = this.MessageContext.get("templateId") === "{A89CF30C-EDFA-442E-8048-9234980E2176}" ? true : false;
      this.isExistingPageBased = this.MessageContext.get("isExistingPageBased");

      // Needed to make request to server.
      // TODO: need to re-factor piplines and remove this useless stuff
      this.messageVariantsContext = {
        currentContext: {
          messageId: this.MessageContext.get("messageId"),
          language: this.MessageContext.get("language"),
          messageBar: this.MessageBar,
          variantId: this.MessageVariants.get("selectedVariant") ? this.MessageVariants.get("selectedVariant").id : null
        },
        app: this
      }

      this.variantActionsState = {
        remove: this.isAbTesting && !this.isSubscriptionFromHTML,
        duplicate: this.isAbTesting && !this.isSubscriptionFromHTML,
        abTestingResults: this.isAbTesting && !this.isSubscriptionFromHTML,
        add: this.isAbTesting && !this.isSubscriptionFromHTML && !this.isExistingPageBased,
        insertToken: true,
        editBody: !this.isExistingPageTemplate || !this.isExistingPageBased,
        sendQuickTest: true,
        previewRecipient: true
      };

      this.MessageVariant = this.MessageVariants.viewModel.getChild("MessageVariant");

      this.messageVariantActions = this.MessageVariant.viewModel.getChild("Actions").get("actions");

      this.attachEventHandlers();

      this.initMessageVariants();

      this.setMessageTokensContext();

      sitecore.trigger("change:messageContext");
    },

    setMessageTokensContext: function() {
      var tokensContext = MessageTokenService.get("context");
      if (!tokensContext) {
        MessageTokenService.set("context", {
          managerRootId: sessionStorage.managerRootId,
          contactId: null
        });
      }
    },

    initMessageVariants: function() {
      if (!sitecore || !this.MessageContext || !this.MessageBar) {
        return;
      }

      if (this.MessageContext.get("isReadonly")) {
        this.setMessageVariantsState("disabled");
      } else if (!this.MessageContext.get("isAbTesting") || this.isSubscriptionFromHTML || this.isExistingPageBased) {
        this.setMessageVariantsState("singlevariant");
      }

      if (this.isExistingPageTemplate || this.isExistingPageBased) {
        this.MessageVariant.set("isExistingPageBased", true);
      }

      this.onMessageVariantsChanged();
    },
    
    disableMessageVariantActions: function() {
      _.each(this.messageVariantActions, function (action) {
        action.disable();
      });
    },

    setMessageVariantsActionsState: function() {
      _.each(this.messageVariantActions, _.bind(function (action) {
        var actionName = this.variantActionsMap[action.id()];
        action[this.variantActionsState[actionName] ? "enable" : "disable"]();
      }, this));
    },

    setMessageVariantsState: function (state) {
      var addButton = this.MessageVariants.viewModel.getChild("AddButton");
      switch (state) {
        case "multivariate":
          this.setMessageVariantsActionsState();
          addButton.set("isVisible", true);
          break;
        case "singlevariant":
          this.setMessageVariantsActionsState();
          addButton.set("isVisible", false);
          break;
        case "disabled":
          this.disableMessageVariantActions();
          this.MessageVariant.set("isReadOnly", true);
          addButton.set("isVisible", false);
          break;
        case "enabled":
          this.setMessageVariantsState(this.MessageContext.get("isAbTesting") ? "multivariate" : "singlevariant");
          this.MessageVariant.set("isReadOnly", false);
          break;
      }
    },

    attachEventHandlers: function () {
      this.MessageContext.on({
        "change:language": function() {
          this.messageVariantsContext.currentContext.language = this.MessageContext.get("language");
        },
        "change:variants": this.onMessageVariantsChanged,
        "change:isReadonly": function () {
          this.setMessageVariantsState(this.MessageContext.get("isReadonly") ? "disabled" : "enabled");
          this.onMessageVariantsChanged();
        }
      }, this);

      this.MessageVariants.on({
        "modified": this.onMessageVariantModified,
        "select:variant": this.onSelectMessageVariant
      }, this);

      this.on({
        "action:addvariant": this.onAddVariant,
        "action:removevariant": this.onRemoveVariant,
        "action:duplicatevariant": this.onDuplicateVariant,
        "action:editmessagevariantcontent": this.onEditMessageVariantContent,
        "action:sendquicktest": function () {
          sitecore.trigger("action:switchtab", { tab: 3, subtab: 0 });
        },
        "action:seeabtestresults": function () {
          sitecore.trigger("action:switchtab", { tab: 4 });
        },
        "action:insertpersonalizationtoken": function () {
          messages_InitializePersonalizationTokenDialog(sitecore, this);
        },
        "action:previewrecipients": function () {
          sitecore.trigger("action:previewrecipients");
        },
        "action:addattachment": function () {
          sitecore.trigger("action:addattachment");
        }
      }, this);
    },

    onAddVariant: function () {
      this.MessageContext.set("isBusy", true);
      AddVariant.execute(this.messageVariantsContext, _.bind(function (variant) {
        this.MessageVariants.addVariant(variant);
        this.MessageContext.set("variants", this.MessageVariants.get("variants"), { silent: true });
        this.MessageContext.set("isBusy", false);
        sitecore.trigger("change:messageContext");
      }, this));
    },

    onRemoveVariant: function () {
      sitecore.trigger("confirmdialog", {
        ok: _.bind(function () {
          this.MessageContext.set("isBusy", true);
          RemoveVariant.execute(this.messageVariantsContext, _.bind(function (variantId) {
            this.MessageVariants.removeVariant(variantId);
            this.MessageContext.set("variants", this.MessageVariants.get("variants"), { silent: true });
            this.MessageContext.set("isBusy", false);
            sitecore.trigger("change:messageContext");
          }, this));
        }, this),
        text: sitecore.Resources.Dictionary.translate("ECM.Pages.Message.AreYouSureYouWantToDeleteVariant"),
        title: sitecore.Resources.Dictionary.translate("ECM.AreYouSure")
      });
    },

    onDuplicateVariant: function () {
      this.MessageContext.set("isBusy", true);
      var variantsContextClone = _.clone(this.messageVariantsContext);
      if (this.MessageContext.get("isModified")) {
        variantsContextClone.currentContext.message = this.MessageContext.getMessage();
        sitecore.Pipelines.SaveMessage.execute(variantsContextClone);
        if (variantsContextClone.errorCount === 0) {
          this.MessageContext.set("isModified", false);
        }
      }
      DuplicateVariant.execute(variantsContextClone, _.bind(function (variant) {
        this.MessageVariants.addVariant(variant);
        this.MessageContext.set("variants", this.MessageVariants.get("variants"), { silent: true });
        this.MessageContext.set("isBusy", false);
        sitecore.trigger("change:messageContext");
      }, this));
    },

    onEditMessageVariantContent: function () {
      initMessageVariantContentEditorDialog(this, this.MessageVariants.get("selectedVariant"), _.bind(function () {
        this.MessageVariants.viewModel.updateVariant();
      }, this));
    },

    onMessageVariantModified: function () {
      this.MessageContext.set("variants", this.MessageVariants.get("variants"));
      this.MessageContext.set("isModified", true);
    },

    onSelectMessageVariant: function (variant) {
      this.messageVariantsContext.currentContext.variantId = variant.id;
    },

    onMessageVariantsChanged: function () {
      this.MessageVariants.set("variants", this.MessageContext.get("variants"));
    }
  });

  return messageTab;
});
