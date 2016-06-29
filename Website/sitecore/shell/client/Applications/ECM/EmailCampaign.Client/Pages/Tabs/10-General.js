define([
    "sitecore",
    "/-/speak/v1/ecm/GlobalValidationService.js"
], function(
    sitecore,
    GlobalValidationService
) {
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

        function onChangeMessageInput() {
            if (!langaugeVersionExist()) {
                return;
            }
            sitecore.trigger("change:messageContext", this);
        }

        function langaugeVersionExist() {
            if (!messageContext || !contextApp.LanguageSwitcher) {
                return false;
            }

            return _.contains(messageContext.get("languages"), contextApp.LanguageSwitcher.get("selectedLanguage"));
        }

        contextApp.NameTextBox.on("change:text", onChangeMessageInput);

        contextApp.FromNameTextBox.on("change:text", onChangeMessageInput);

        contextApp.FromEmailTextBox.on("change:text", onChangeMessageInput);

        contextApp.ReplyToTextBox.on("change:text", onChangeMessageInput);
    }

    function addModifiedListeners(contextApp, messageContext) {
        if (!contextApp || !messageContext) {
            return;
        }
        // Listen  for text box changes
        listenToTextbox(contextApp.NameTextBox, messageContext, "messageName");
        listenToTextbox(contextApp.DescriptionArea, messageContext, "description");
        // TODO: Campaign Category 
        listenToTextbox(contextApp.FromNameTextBox, messageContext, "fromName");
        listenToTextbox(contextApp.FromEmailTextBox, messageContext, "fromEmail");
        listenToTextbox(contextApp.ReplyToTextBox, messageContext, "replyTo");

        //Listen to accordion changes
        listenToSenderAccordion(contextApp);
    }

    function listenToTextbox(textbox, messageContext, propertyName) {
        if (!textbox || !messageContext || !propertyName) {
            return;
        }
        textbox.on("change:text", function() {
            messageContext.set(propertyName, textbox.get("text"));
        });
    }

    function generalTab_InitTargetDeviceCombobx(contextApp, messageBar) {
        var deviceCombo = contextApp.TargetDeviceComboBox;
        var messageContext = contextApp.MessageContext;

        var targetDevice = messageContext.get("targetDevice");
        var dcList = deviceCombo.get("items");
        if (targetDevice == "" || targetDevice == undefined || dcList == undefined) {
            setTimeout(function() {
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

        deviceCombo.set("selectedItem", selectedItem);

        deviceCombo.on('change:selectedItemId', function () {
            messageContext.set('targetDevice', deviceCombo.get('selectedItemId'));
        });

        GlobalValidationService.addInput({
            input: contextApp.TargetDeviceComboBox,
            validateEvent: 'change:selectedItem',
            validators: {
                remote: {
                    params: function() {
                        var selected = contextApp.TargetDeviceComboBox.get('selectedItem');
                        return { deviceId: selected.id, messageId: contextApp.MessageContext.get("messageId") }
                    },
                    requestParams: {
                        url: '/sitecore/api/ssc/EXM/ValidateDevice',
                        async: false
                    }
                }
            }
        });
    }

    function getActiveTreeViewItem(campaignCategoryPath, treeView, dialogWindow) {
        var arr = campaignCategoryPath.split("/");
        treeView.viewModel.$el.find("span.dynatree-expander").click();
        var selectedLink = treeView.viewModel.$el.find("a.dynatree-title").filter(function() { return $(this).text() === arr[arr.length - 1]; });
        if (selectedLink.length > 0) {
            selectedLink.click();
        } else {
            setTimeout(function() {
                getActiveTreeViewItem(campaignCategoryPath, treeView, dialogWindow);
            }, 300);
            return;
        }
        dialogWindow.show();
    }

    function generalTab_HideCampaignCategoryDialog(contextApp) {
        var selectItem = contextApp.CampaignCategoryTreeView.viewModel.getActiveNode();

        var campaignCategoryPath = selectItem.data.path.replace("/sitecore/system/Marketing Control Panel/Campaigns", "");
        contextApp.CampaignCategoryTextBox.set("text", campaignCategoryPath);
        contextApp.MessageContext.set("campaignCategoryPath", campaignCategoryPath);
        contextApp.MessageContext.set("campaignCategory", selectItem.data.key);
        contextApp.CampaignCategoryDialogWindow.hide();
    }

    function generalTab_HideCampaignGroupDialog(contextApp) {
        var selectItem = contextApp.CampaignGroupTreeView.viewModel.getActiveNode();
        if (selectItem == null) {
            alert("Please, select group");
        } else if (selectItem.data.rawItem && selectItem.data.rawItem.$templateId == "{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}") {
            alert("Please, select group, not folder");
        } else {
            var campaignGroupPath = selectItem.data.path.replace("/sitecore/system/Marketing Control Panel/Taxonomies", "");
            contextApp.CampaignGroupTextBox.set("text", campaignGroupPath);
            contextApp.MessageContext.set("campaignGroupPath", campaignGroupPath);
            contextApp.MessageContext.set("campaignGroup", selectItem.data.key);
            contextApp.CampaignGroupDialogWindow.hide();
        }
    }

    function listenToSenderAccordion(contextApp) {
        contextApp.SenderAccordion.on("change:isOpen", function() {
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

    var generalTab = sitecore.Definitions.App.extend({
        initialized: function() {
            var contextApp = this;
            sitecore.trigger("mainApp", this);

            this.on("select:campaign:category:browse", this.showCampaignCategoryDialog, this);
            this.on("select:campaign:category:ok", this.hideCampaignCategoryDialog, this);
            this.on("select:campaign:category:cancel", this.cancelCampaignCategoryDialog, this);
            this.on("select:campaign:group:browse", this.showCampaignGroupDialog, this);
            this.on("select:campaign:group:ok", this.hideCampaignGroupDialog, this);
            this.on("select:campaign:group:cancel", this.cancelCampaignGroupDialog, this);

            sitecore.on("change:messageContext", function() {
                contextApp.updateTextBoxes(contextApp);
            });

            initGeneralTab(sitecore, contextApp);
            generalTab_InitTargetDeviceCombobx(contextApp, this.MessageBar);
            sitecore.trigger("change:messageContext");
            this.setupValidation();
        },
        setupValidation: function() {
            GlobalValidationService.addInputs([
                {
                    input: this.NameTextBox,
                    validators: {
                        nameIsValid: {
                            params: {
                                expression: this.MessageContext.get("itemNameValidation")
                            }
                        }
                    }
                },
                {
                    input: this.FromEmailTextBox,
                    validators: {
                        required: {
                            message: sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.FromAddressRequired")
                        },
                        email: {
                            message: sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.FromEmailNotValid")
                        }
                    }
                },
                {
                    input: [this.FromEmailTextBox, this.FromNameTextBox],
                    validators: {
                        summaryMax: {
                            message: sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.FromNamePlusFromAddressIsToLong"),
                            params: {
                                max: 254
                            }
                        }
                    }
                },
                {
                    input: this.ReplyToTextBox,
                    optional: true,
                    validators: {
                        email: {
                            message: sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.ReplyToNotValid")
                        }
                    }
                }
            ]);

        },
        showCampaignCategoryDialog: function() {
            getActiveTreeViewItem(this.MessageContext.get("campaignCategoryPath"), this.CampaignCategoryTreeView, this.CampaignCategoryDialogWindow);
        },
        hideCampaignCategoryDialog: function() {
            generalTab_HideCampaignCategoryDialog(this);
        },
        cancelCampaignCategoryDialog: function() {
            this.CampaignCategoryDialogWindow.hide();
        },
        showCampaignGroupDialog: function() {
            getActiveTreeViewItem(this.MessageContext.get("campaignGroupPath"), this.CampaignGroupTreeView, this.CampaignGroupDialogWindow);
        },
        hideCampaignGroupDialog: function() {
            generalTab_HideCampaignGroupDialog(this);
        },
        cancelCampaignGroupDialog: function() {
            this.CampaignGroupDialogWindow.hide();
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

            setReadOnlyToTextBox(contextApp.CampaignCategoryTextBox);
            contextApp.CampaignCategoryTextBox.set("text", contextApp.MessageContext.get("campaignCategoryPath"));
            setReadOnlyToTextBox(contextApp.CampaignGroupTextBox);
            contextApp.CampaignGroupTextBox.set("text", contextApp.MessageContext.get("campaignGroupPath"));

            contextApp.TargetDeviceComboBox.set("isEnabled", !isReadOnly);

            contextApp.TemplateNameValueLabel.set("text", contextApp.MessageContext.get("templateName"));
            contextApp.TemplateThumbnailImage.set("imageUrl", contextApp.MessageContext.get("thumbnail"));

            function setReadOnlyToTextBox(textbox) {
                var textBtn = textbox.viewModel.$el;
                textBtn.find('input').attr('disabled', 'true');
                textBtn.find('button').attr('disabled', isReadOnly);
            }
        }
    });

    return generalTab;
});