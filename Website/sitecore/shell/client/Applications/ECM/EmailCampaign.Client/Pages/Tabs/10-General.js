define(["sitecore"], function (sitecore) {
  var generalTab = sitecore.Definitions.App.extend({
    initialized: function () {
      var contextApp = this;
      sitecore.trigger("mainApp", this);

      this.on("select:campaign:category:browse", this.showCampaignCategoryDialog, this);
      this.on("select:campaign:category:ok", this.hideCampaignCategoryDialog, this);
      this.on("select:campaign:category:cancel", this.cancelCampaignCategoryDialog, this);
      
      sitecore.on("change:messageContext", function() {
        contextApp.updateTextBoxes(contextApp);
        resizeCampaignCategoryTextBox(contextApp);
      });

      initGeneralTab(sitecore, contextApp);
      generalTab_InitTargetDeviceCombobx(contextApp, this.MessageBar);

      sitecore.trigger("change:messageContext");
    },

    showCampaignCategoryDialog: function () {
      generalTab_ShowCampaignCategoryDialog(this);
    },
    hideCampaignCategoryDialog: function () {
      generalTab_HideCampaignCategoryDialog(this);
    },
    cancelCampaignCategoryDialog: function () {
      generalTab_CancelCampaignCategoryDialog(this);
    },
    updateTextBoxes: function(contextApp) {
      var isReadOnly = contextApp.MessageContext.get("isReadonly");
      var isSenderDetailsReadonly = contextApp.MessageContext.get("isSenderDetailsReadonly");

      contextApp.NameTextBox.set("isReadOnly", isReadOnly);
      contextApp.NameTextBox.set("text", contextApp.MessageContext.get("messageName"));
      contextApp.DescriptionArea.set("isReadOnly", isReadOnly);
      contextApp.DescriptionArea.set("text", contextApp.MessageContext.get("description"));

      contextApp.FromNameTextBox.set("isReadOnly", isSenderDetailsReadonly);
      contextApp.FromNameTextBox.set("text", contextApp.MessageContext.get("fromName"));
      contextApp.FromEmailTextBox.set("isReadOnly", isSenderDetailsReadonly);
      contextApp.FromEmailTextBox.set("text", contextApp.MessageContext.get("fromEmail"));
      contextApp.ReplyToTextBox.set("isReadOnly", isSenderDetailsReadonly);
      contextApp.ReplyToTextBox.set("text", contextApp.MessageContext.get("replyTo"));

      contextApp.CampaignCategoryTextBox.set("text", contextApp.MessageContext.get("campaignCategoryPath"));
      contextApp.CampaignCategoryOpenPopupBtn.set("isEnabled", !isReadOnly);

      contextApp.TemplateNameValueLabel.set("text", contextApp.MessageContext.get("templateName"));
      contextApp.TemplateThumbnailImage.set("imageUrl", contextApp.MessageContext.get("thumbnail"));
    }
  });

  return generalTab;
});

function initGeneralTab(sitecore, contextApp) {
  if (!sitecore || !contextApp) {
    return;
  }

  var messageContext = contextApp.MessageContext;
  var messageBar = contextApp.MessageBar;
  if (!messageContext || !messageBar) {
    return;
  }

  sitecore.on("message:switchtosubscriptionmessage", function() {
    contextApp.MessageContext.set("isSenderDetailsReadonly", true);
    sitecore.trigger("change:messageContext", this);
  });

  addModifiedListeners(contextApp, messageContext, messageBar);

  contextApp.NameTextBox.on("change:text", function () {
    nameIsValid(this.get("text"), messageBar, sitecore);
    validation_checkIsModify(messageContext, messageBar);
    sitecore.trigger("change:messageContext", this);
  });

  contextApp.FromNameTextBox.on("change:text", function () {
    fromNameIsValid(this.get("text"), contextApp.FromEmailTextBox.get("text"), messageBar, sitecore);
    validation_checkIsModify(messageContext, messageBar);
    sitecore.trigger("change:messageContext", this);
  });

  contextApp.FromEmailTextBox.on("change:text", function () {
    fromEmailIsValid(this.get("text"), contextApp.FromNameTextBox.get("text"), messageBar, sitecore);
    validation_checkIsModify(messageContext, messageBar);
    sitecore.trigger("change:messageContext", this);
  });

  contextApp.ReplyToTextBox.on("change:text", function () {
    replyToTextBoxIsValid(this.get("text"), messageBar, sitecore);
    validation_checkIsModify(messageContext, messageBar);
    sitecore.trigger("change:messageContext", this);
  });
}

function addModifiedListeners(contextApp, messageContext, messageBar) {
  if (!contextApp || !messageContext) { return; }
  // Listen  for text box changes
  listenToTextbox(contextApp.NameTextBox, messageContext, "messageName");
  listenToTextbox(contextApp.DescriptionArea, messageContext, "description");
  // TODO: Campaign Category 
  listenToTextbox(contextApp.FromNameTextBox, messageContext, "fromName");
  listenToTextbox(contextApp.FromEmailTextBox, messageContext, "fromEmail");
  listenToTextbox(contextApp.ReplyToTextBox, messageContext, "replyTo");

  //Listen to accordion changes
  listenToSenderAccordion(contextApp);
  listenToResizeWindow(contextApp);
}

function resizeCampaignCategoryTextBox(contextApp) {
  contextApp.CampaignCategoryTextBox.viewModel.$el.width(contextApp.NameTextBox.viewModel.$el.width() - 99);
}

function listenToResizeWindow(contextApp) {
  $(window).resize(function () {
    resizeCampaignCategoryTextBox(contextApp);
  });
}

function listenToTargetDeviceComboBox(control, messageContext, messageBar, propertyName) {
  if (!control || !messageContext || !propertyName) { return; }
  control.on("change", function () {
    // prevent opening of items list if readonly state
    if (messageContext.get("isReadonly")) {
      this.viewModel.$el.on('focus mousedown', function (e) {
        e.preventDefault();
        this.blur();
        window.focus();
      });
    }
  });

  control.on("change:selectedItem", function (arguments1, arguments2, argument3) {
    var selectedItem = this.get("selectedItem");
    if (selectedItem != undefined && selectedItem.id != undefined && !messageContext.get("isReadonly")) {
      validateDevice(selectedItem.id, messageContext.get("messageId"), messageBar, messageContext, propertyName);
    }
  });
}

function validateDevice(deviceId, messageId, messageBar, messageContext, propertyName) {
  var errMessageId = "targetDeviceIsNotValid";
  messageBar.removeMessage(function (error) { return error.id === errMessageId; });
  postServerRequest("ecm.savemessage.validatedevice", { deviceId: deviceId, messageId: messageId }, function (response) {
    if (response.error) {
      var messagetoAdd = createErrorMessage(errMessageId, response.errorMessage);
      messageBar.addMessage("error", messagetoAdd);
    }
    messageContext.set(propertyName, deviceId);
    validation_checkIsModify(messageContext, messageBar);
  });
}

function listenToTextbox(textbox, messageContext, propertyName) {
  if (!textbox || !messageContext || !propertyName) { return; }
  textbox.on("change:text", function () {
    messageContext.set(propertyName, textbox.get("text"));
  });
}

function generalTab_InitTargetDeviceCombobx(contextApp, messageBar) {
  var deviceCombo = contextApp.TargetDeviceComboBox;
  var messageContext = contextApp.MessageContext;

  var targetDevice = messageContext.get("targetDevice");
  var dcList = deviceCombo.get("items");
  if (targetDevice == "" || targetDevice == undefined || dcList == undefined) {
    setTimeout(function () {
      generalTab_InitTargetDeviceCombobx(contextApp, messageBar);
    }, 300);
    return;
  }

  var selectedItem = null;
  for (var i = 0; i < dcList.length; i++) {
    if (dcList[i].id == targetDevice) {
      selectedItem = dcList[i];
    }
  }

  listenToTargetDeviceComboBox(contextApp.TargetDeviceComboBox, messageContext, messageBar, "targetDevice");

  deviceCombo.set("selectedItem", selectedItem);

  if (messageContext.get("isReadonly")) {
    deviceCombo.viewModel.$el.attr("readonly", "true");
  }
}

function generalTab_ShowCampaignCategoryDialog(contextApp) {
  var arr = contextApp.MessageContext.get("campaignCategoryPath").split("/");
  contextApp.CampaignCategoryTreeView.viewModel.$el.find("span.dynatree-expander").click();
  var selectedLink = contextApp.CampaignCategoryTreeView.viewModel.$el.find("a.dynatree-title").filter(function () { return $(this).text() === arr[arr.length - 1]; });
  if (selectedLink.length > 0) {
    selectedLink.click();
  } else {
    setTimeout(function () {
      generalTab_ShowCampaignCategoryDialog(contextApp);
    }, 300);
    return;
  }
  contextApp.CampaignCategoryDialogWindow.show();
}

function generalTab_HideCampaignCategoryDialog(contextApp) {
  var selectItem = contextApp.CampaignCategoryTreeView.viewModel.getActiveNode();
  var campaignCategoryPath = selectItem.data.path.replace("/sitecore/system/Marketing Center/Campaigns", "");
  contextApp.CampaignCategoryTextBox.set("text", campaignCategoryPath);
  contextApp.MessageContext.set("campaignCategoryPath", campaignCategoryPath);
  contextApp.MessageContext.set("campaignCategory", selectItem.data.key);
  contextApp.CampaignCategoryDialogWindow.hide();
}

function generalTab_CancelCampaignCategoryDialog(contextApp) {
  contextApp.CampaignCategoryDialogWindow.hide();
}

function listenToSenderAccordion(contextApp) {
  contextApp.SenderAccordion.on("change:isOpen", function () {
    var accordionHeaderElm = contextApp.SenderAccordion.viewModel.$el.children(".sc-accordion-header").find(".sc-accordion-header-title .sc-accordion-header-cell")[1];
    if (!contextApp.SenderAccordion.get("isOpen")) {
      if (accordionHeaderElm) {
        var descriptionText = contextApp.FromNameTextBox.get("text") + " | " + contextApp.FromEmailTextBox.get("text");
        $(accordionHeaderElm).append("<div class='field-description' style='font-weight:normal; color:#999999'>" + descriptionText + "</div>");
      }
    } else {
      $(accordionHeaderElm).find("div.field-description").remove();
    }
  });
}