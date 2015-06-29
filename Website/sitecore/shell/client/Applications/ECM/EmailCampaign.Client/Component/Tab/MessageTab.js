define(["sitecore", "/-/speak/v1/ecm/InsertToken.js", "/-/speak/v1/ecm/Validation.js"]);
// Note: as the tab control can not have its own sub page code, we have a javascript for each tab and require it in the page code.

function initMessageTab(sitecore, contextApp) {
  if (!sitecore || !contextApp) {
    return;
  }

  var messageContext = contextApp.MessageContext;
  var messageBar = contextApp.MessageBar;
  if (!messageContext || !messageBar) {
    return;
  }

  var isExistingPageTemplate = false;
  var isExistingPageBased = false;
  variantsChanged();
  setAttachmentActionsEnabled();

  messageContext.on("change:variants", variantsChanged);

  function variantsChanged() {
    if (contextApp.MessageVariantRepeater.get("isLoading")) {
      setTimeout(variantsChanged, 200);
      return;
    }

    contextApp.MessageVariantRepeater.viewModel.reset();
    initMessagevariants(messageContext.get("variants"), contextApp.MessageVariantRepeater);
  }

  contextApp.MessageVariantRepeater.RenderedItems.on("remove", function (arg) {
    if (arg.collection.length === 1) {
      setRemoveVariantAction(arg.collection.models[0].get("app").MessageVariantActionControl.get("actions"), false);
    }

    for (var i = 0; i < arg.collection.models.length; i++) {
      updateMessageVariantHeader(arg.collection.models[i], i);
    }
  });

  contextApp.MessageVariantRepeater.RenderedItems.on("add", function (arg) {
    isExistingPageTemplate = messageContext.get("templateId") === "{A89CF30C-EDFA-442E-8048-9234980E2176}" ? true : false;
    isExistingPageBased = messageContext.get("isExistingPageBased");
    if (!messageContext.get("isAbTesting")) {
      for (var i = 0; i < arg.collection.models.length; i++) {
        disableVariantActions(arg.collection.models[i].get("app").MessageVariantActionControl.get("actions"), true, isExistingPageTemplate ? false : true);
      }
    } else if (messageContext.get("isReadonly")) {
      for (var i = 0; i < arg.collection.models.length; i++) {
        disableVariantActions(arg.collection.models[i].get("app").MessageVariantActionControl.get("actions"), false, false);
        arg.collection.models[i].get("app").SubjectTextBox.set("isReadOnly", true);
        arg.collection.models[i].get("app").BodyFrame.set("isReadOnly", true);
        arg.collection.models[i].get("app").AlternativeTextArea.set("isReadOnly", true);
      }
    } else {
      if (arg.collection.length === 1) {
        setRemoveVariantAction(arg.collection.models[0].get("app").MessageVariantActionControl.get("actions"), false);
        if (isExistingPageBased) {
          disableVariantActions(arg.collection.models[0].get("app").MessageVariantActionControl.get("actions"), true, false);
        }
      } else {
        setRemoveVariantAction(arg.collection.models[0].get("app").MessageVariantActionControl.get("actions"), true);
      }
    }
    updateMessageVariantHeader(arg, contextApp.MessageVariantRepeater.RenderedItems.models.length - 1);

    if (arg.get("item").Focus == "true") {
      $('html, body').animate({ scrollTop: arg.get("app").SubjectTextBox.viewModel.$el.offset().top }, 800, "linear");
    }

    var app = arg.get("app");
    if (isExistingPageTemplate || isExistingPageBased) {
      app.SubjectTextBox.viewModel.disable();
      app.BodyFrame.set("isReadOnly", true);
    }

    if (messageContext.get("templateId") === "{1AFE38A7-9461-4278-ADAF-D807F27F36E4}") {
      app.MessageVariantAccordion.set("enableAdditional", false);
    }

    // Delete the temp item in the core database.
    var item = contextApp.MessageVariantRepeater.getItem(app);

    postServerRequest("ecm.deleteMessageVariantItem.delete", { value: item.itemId }, function (response) {
      if (response.error) {
        return;
      }
      if (!response.value) {
        return;
      }
    }, false);

    // Binding of InsertToken when all variants are rendered
    if (this.length == contextApp.MessageContext.get("variants").length) {
      InsertToken.Init("MessageVariantRepeater", messageContext.get("isReadonly"), null);
      initMessageVariantsBodyCursorStyle();
    }
  });

  sitecore.on("action:abtesting:variant:add", function () {
    messageContext.set("isBusy", true);
    setTimeout(function () {
      contextApp.currentContext = {
        messageId: messageContext.get("messageId"),
        language: messageContext.get("language"),
        messageBar: messageBar
      };
      var context = clone(contextApp.currentContext);

      sitecore.Pipelines.AddVariant.execute({ app: contextApp, currentContext: context });
      if (!context.newVariant) { return; }
      var variant = context.newVariant;
      addVariantToMessageVariantRepeater(variant, "true", contextApp.MessageVariantRepeater, messageContext);
    }, 100);
  }, contextApp);

  sitecore.on("action:abtesting:variant:remove", function (app) {
    messageContext.set("isBusy", true);
    setTimeout(function () {
      var variantId = app.variant.VariantIdText.get("text");
      contextApp.currentContext = {
        messageId: messageContext.get("messageId"),
        variantId: variantId,
        language: messageContext.get("language"),
        messageBar: messageBar
      };
      var context = clone(contextApp.currentContext);
      sitecore.Pipelines.RemoveVariant.execute({ app: contextApp, currentContext: context });
      if (context.errorCount > 0) { return; }
      removeVariantFromMessageVariantRepeater(app.variant, contextApp.MessageVariantRepeater, variantId);
    }, 100);
  }, contextApp);

  sitecore.on("action:abtesting:variant:duplicate", function (app) {
    messageContext.set("isBusy", true);
    setTimeout(function () {
      var variantId = app.variant.VariantIdText.get("text");
      contextApp.currentContext = {
        messageId: messageContext.get("messageId"),
        variantId: variantId,
        language: messageContext.get("language"),
        messageBar: messageBar
      };
      var context = clone(contextApp.currentContext);
      sitecore.Pipelines.DuplicateVariant.execute({ app: contextApp, currentContext: context });
      if (context.errorCount > 0) { return; }
      var variant = context.newVariant;
      addVariantToMessageVariantRepeater(variant, "true", contextApp.MessageVariantRepeater, messageContext);
    }, 100);
  }, contextApp);

  contextApp.on("action:deleteattachment", function () { removeSelectedAttachments(); }, contextApp);
  contextApp.AttachmentsListControl.on("change:selectedItemId change:checkedItemIds", function () { setAttachmentActionsEnabled(); });
  contextApp.RecipientPreviewListControl.on("change:selectedItemId", function () { onPreviewContactSelectionChanged(); });
  messageContext.on("change:isReadonly", function() {
    setAttachmentActionsEnabled();
    variantsChanged();
  });
  messageContext.on("change:attachments", updateAttachmentButtonText, contextApp);

  sitecore.on("action:messagecontent:insertpersonalizationtoken", function () { InsertToken.GetDialog(sitecore, contextApp); }, contextApp);

  sitecore.on("change:variantsubject", function (app) {
    var variantId = app.variant.VariantIdText.get("text");
    var variants = messageContext.get("variants");

    for (var i = 0; i < variants.length; i++) {
      if (variants[i].id === variantId) {
        if (variants[i].subject !== app.variant.SubjectTextBox.get("text")) {
          variants[i].subject = app.variant.SubjectTextBox.get("text");
          variants[i].readOnly = false;
          messageContext.set("isModified", true);
        }
        break;
      }
    }
  }, contextApp);

  sitecore.on("change:variantalternativetext", function (app) {
    var variantId = app.variant.VariantIdText.get("text");
    var variants = messageContext.get("variants");

    for (var i = 0; i < variants.length; i++) {
      if (variants[i].id === variantId) {
        if (variants[i].alternativeText !== app.variant.AlternativeTextArea.get("text")) {
          variants[i].alternativeText = app.variant.AlternativeTextArea.get("text");
          variants[i].readOnly = false;
          messageContext.set("isModified", true);
        }
        break;
      }
    }
  }, contextApp);

  sitecore.on("action:messagevariantcontent:editcontent", function (variantContext) {
    initMessageVariantContentEditorDialog(variantContext);
  }, contextApp);

  function initMessagevariants(variants, messageVariantRepeater) {
    if (!variants) {
      console.log("error");
      return;
    }
    for (var i = 0; i < variants.length; i++) {
      var variant = variants[i];
      addVariantToMessageVariantRepeater(variant, "false", messageVariantRepeater, null);
    }
  }

  function updateAttachmentButtonText(message, attachments) {
    if (!attachments) {
      attachments = contextApp.MessageContext.get("attachments");
    }

    var text = sitecore.Resources.Dictionary.translate("ECM.Pages.Message.AttachmentsDropDownButtonText").replace("{0}", attachments.length);

    this.AttachmentsDropDownButton.set("text", text);
  }

  function addVariantToMessageVariantRepeater(variant, focus, messageVariantRepeater, messageContextVar) {
    var context = {
      variantId: variant.id,
      subject: variant.subject,
      bodyUrl: encodeURIComponent(variant.bodyUrl),
      alternativeText: variant.alternativeText,
      focus: focus,
      urlToEdit: encodeURIComponent(variant.urlToEdit),
    };

    postServerRequest("ecm.createNewMessageVariantItem.create", { variantId: context.variantId, subject: context.subject, bodyUrl: context.bodyUrl, alternativeText: context.alternativeText, focus: context.focus, urlToEdit: context.urlToEdit }, function (response) {
      if (response.error) {
        context.errorCount = 1;
        context.aborted = true;
        return;
      }
      if (!response.value) {
        context.aborted = true;
        context.errorCount = 1;
        return;
      } else {
        context.newItemId = response.value;
      }
    }, false);
    if (context.errorCount > 0) { return; }
    var item = {
      itemId: context.newItemId,
      $database: "core",
      Focus: focus
    };
    messageVariantRepeater.viewModel.add(item);
    if (messageContextVar != null) {
      var last = messageContextVar.get("variants").length;
      messageContext.off("change:variants", variantsChanged);
      messageContextVar.viewModel.variants.splice(last, 0, variant);
      messageContext.on("change:variants", variantsChanged);
    }
  }

  function setAttachmentActionsEnabled() {
    var areActionsEnabled = !messageContext.get("isReadonly");
    var areAttachmentsSelected = contextApp.AttachmentsListControl.get("selectedItemId") != "" || contextApp.AttachmentsListControl.get("checkedItemIds").length > 0;

    $.each(contextApp.AttachmentActionControl.get("actions"), function (actionIndex, action) {
      var isActionEnabled = (action.id() == "3E03CA0B499D47A7B6087AA72432B1D4")
        ? areActionsEnabled && areAttachmentsSelected
        : areActionsEnabled;

      if (isActionEnabled) {
        action.enable();
      } else {
        action.disable();
      }
    });
  }

  function onPreviewContactSelectionChanged() {
    var personalizationContactId = contextApp.RecipientPreviewListControl.get("selectedItemId");

    if (personalizationContactId === "") {
      personalizationContactId = null;
    }

    sitecore.trigger("change:personalizationRecipientId", (personalizationContactId) ? ("xdb:" + personalizationContactId) : null);

    if (this.length == contextApp.MessageContext.get("variants").length) {
      InsertToken.Init("MessageVariantRepeater", messageContext.get("isReadonly"), personalizationContactId);
    }
  }

  function removeVariantFromMessageVariantRepeater(variant, messageVariantRepeater, variantId) {
    messageVariantRepeater.remove(variant);
    messageContext.viewModel.variants.remove(function (mcVariant) {
      return mcVariant.id == variantId;
    });
  }

  function updateMessageVariantHeader(model, index) {
    var messageVariantAccordionHeaderElem = model.get("app").MessageVariantAccordion.viewModel.$el.children(".sc-advancedExpander-header").find(".sc-advancedExpander-header-title-text");
    if (messageVariantAccordionHeaderElem) {
      var letter = String.fromCharCode(index + 65);

      var existingLetterElem = $(messageVariantAccordionHeaderElem).find(".abn-letter");
      if (existingLetterElem.length > 0) {
        $(existingLetterElem).html(letter);
      } else {
        var letterElem = "<span class='abn-letter'>" + letter + "</span>";
        $(messageVariantAccordionHeaderElem).html($(messageVariantAccordionHeaderElem).html() + letterElem);
      }
    }
  }

  function setRemoveVariantAction(actions, enable) {
    for (var i = 0; i < actions.length; i++) {
      if (actions[i].id() === "50FC3020046340B29C2FAE24A72405F3") {
        if (enable) {
          actions[i].enable();
        } else {
          actions[i].disable();
        }
        break;
      }
    }
  }

  function disableVariantActions(actions, isTokensInsertable, isBodyEditable) {
    for (var i = 0; i < actions.length; i++) {
      if (isTokensInsertable && actions[i].text().trim() == "Insert token") {
        continue;
      }
      if (isBodyEditable && actions[i].text().trim() == "Edit body") {
        continue;
      }
      actions[i].disable();
    }
  }

  function removeSelectedAttachments() {
    if (!messageContext) {
      return;
    }

    var checkedItemIds = contextApp.AttachmentsListControl.get("checkedItemIds");

    if (!checkedItemIds || checkedItemIds.length == 0) {
      var selectedItemId = contextApp.AttachmentsListControl.get("selectedItemId");

      if (selectedItemId == "") {
        return;
      }

      checkedItemIds = [selectedItemId];
    }

    var context = {
      attachmentIds: checkedItemIds,
      messageId: messageContext.get("messageId"),
      language: messageContext.get("language"),
      messageBar: messageBar
    };

    sitecore.Pipelines.RemoveAttachment.execute({ app: contextApp, currentContext: context });
  }

  function initMessageVariantContentEditorDialog(variantContext) {
    if (contextApp["messageVariantContentEditorDialog"] === undefined) {
      contextApp.insertRendering("{8B5A7135-0135-4944-A69F-23D9CD388FE6}", { $el: $("body") }, function (subApp) {
        contextApp["messageVariantContentEditorDialog"] = subApp;
        messageVariantContentEditorDialogShow();
      });
    } else {
      messageVariantContentEditorDialogShow();
    }

    function messageVariantContentEditorDialogShow() {
      sitecore.trigger("message:variant:content:editor:dialog:show", variantContext);
    }
  }

  function initMessageVariantsBodyCursorStyle() {
    if (contextApp.MessageVariantRepeater.get("isLoading")) {
      setTimeout(initMessageVariantsBodyCursorStyle, 500);
      return;
    }
    var cursor = isExistingPageTemplate || isExistingPageBased || messageContext.get("isReadonly") ? "default" : "pointer";
    var frameHtmls = $('iframe[data-sc-id="BodyFrame"]').contents().find('html');
    frameHtmls.css("cursor", cursor);
  }
}