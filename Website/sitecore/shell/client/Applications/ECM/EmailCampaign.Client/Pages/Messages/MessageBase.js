define([
    "sitecore",
    "/-/speak/v1/ecm/PageBase.js",
    "/-/speak/v1/ecm/Language.js",
    "/-/speak/v1/ecm/ServerRequest.js",
    "/-/speak/v1/ecm/DialogService.js",
    "/-/speak/v1/ecm/GlobalValidationService.js",
    "/-/speak/v1/ecm/ValidatorsService.js",
    "/-/speak/v1/ecm/constants.js"
], function(
    sitecore,
    PageBase,
    language,
    ServerRequest,
    DialogService,
    GlobalValidationService,
    ValidatorsService,
    Constants) {
    var messageBase = PageBase.extend({
        messageActionIds: {
            saveAsSubscribtion: '0661D49FE0204040A255705AA20F67FA',
            engagementPlan: '34BE63852A2C4AC6BB3A9F35C3280564'
        },


        initialized: function() {
            this._super();

            this.initActions(this, this.MessageContext);
            this.initButtons();
            this.attachEventHandlers();

            language.initLanguage(this);
            this.initValidation();
        },

        initValidation: function() {
            GlobalValidationService.on({
                'validation:input:error': function(message) {
                    this.MessageBar.removeMessage(function(mess) {
                        return mess.id ? mess.id === message.id : false;
                    });
                    this.MessageBar.addMessage("error", _.extend({ actions: [], closable: true }, message));
                },
                'validation:input:success': function(message) {
                    this.MessageBar.removeMessage(function(mess) {
                        return mess.id ? mess.id.indexOf(message.id) > -1 : false;
                    });
                },
                'change:valid': function() {
                    this.SaveButton.set('isEnabled', GlobalValidationService.get('valid'));
                }
            }, this);
        },

        attachEventHandlers: function() {
            sitecore.on({
                "action:showattachments": function() {
                    DialogService.show("attachments", {
                        data: {
                            MessageContext: this.MessageContext
                        }
                    });
                },
                "change:messageContext": this.toggleSaveAsSubscribtionAction
            }, this);

            this.MessageContext.on({
                "change:isBusy": this.toggleEngagementPlanAction,
                "change:isReadonly": this.toggleEngagementPlanAction,
                "change:messageNotFound": function() {
                    this.MessageBar.addMessage("error", sitecore.Resources.Dictionary.translate("ECM.MessagePage.MessagenotFound"));
                }
            }, this);

            this.EmailManagerRoot.on("change:managerRootId", function() {
                window.parent.location.replace(Constants.URLs.Dashboard);
            });
        },

        initButtons: function() {
            sitecore.on("message:save", function(args) {
                this.trigger("message:save", args);
            }, this);
            this.on("message:back", function() {
                history.back();
            });
        },

        initActions: function() {
            if (!this.MessageContext) {
                return;
            }

            this.on({
                "action:editengagementplan": function() {
                    this.openEngagementPlan(true);
                },
                "action:duplicatemessage": function() {
                    this.copySelectedMessage();
                },
                "action:opensitecoreappcenter": function() {
                    this.openSitecoreAppCenter();
                },
                "action:saveassubscription": this.onSaveAsSubscribtion,
                // TODO: Implement action:import
                "action:import": function() {
                    alert("show exisitng import i.e. (/sitecore/shell/default.aspx?xmlcontrol=EmailCampaign.ImportUsersWizard&itemID={E164FD28-E95B-4F25-A063-61F7AA23FD8F})");
                }
            }, this);

            sitecore.on({
                "action:openengagementplan": function() {
                    this.openEngagementPlan(false);
                },
                "action:addattachment": function() {
                    DialogService.show("addAttachment", {
                        data: {
                            messageId: this.MessageContext.get("messageId"),
                            language: this.MessageContext.get("language")
                        }
                    });
                },
                "attachment:file:added": function() {
                    this.MessageContext.viewModel.refresh();
                },
                "attachment:file:removed": function() {
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

        switchToMessage: function() {
            var urlParams = {
                id: this.MessageContext.get("messageId"),
                sc_speakcontentlang: this.MessageContext.get("language")
            };

            var messagePath = urlService.getUrl(this.getMessageReportUrlKey(), urlParams);
            location.href = messagePath;
        },

        openEngagementPlan: function(editMode) {
            if (!this.MessageBar)
                return;

            var selectedGuid = this.MessageContext.get("messageId");
            if (!selectedGuid || selectedGuid.length == 0) {
                return;
            }

            ServerRequest(Constants.ServerRequests.ENGAGEMENT_PLAN_URL, {
                data: { messageId: selectedGuid, editMode: editMode },
                success: function(response) {
                    if (response.error) {
                        this.MessageBar.addMessage("error", response.errorMessage);
                        return;
                    }

                    if (response.value) {
                        window.open(response.value, "_blank");
                    }
                },
                context: this
            });
        },

        openSitecoreAppCenter: function() {
            if (!this.MessageBar) {
                return;
            }

            ServerRequest(Constants.ServerRequests.APP_CENTER_URL, {
                data: {},
                success: function(response) {
                    if (response.error) {
                        this.MessageBar.addMessage("error", response.errorMessage);
                        return;
                    }

                    if (response.value) {
                        window.open(response.value, "_blank");
                    }
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
            ServerRequest(Constants.ServerRequests.CAN_SAVE_SUBSCRIPTION_TEMPLATE, {
                success: function(response) {
                    var errorMessageId = "error.ecm.saveassubscriptiontemplate.execute";
                    this.MessageBar.removeMessage(function(error) {
                        return error.id === errorMessageId;
                    });
                    if (response.error) {
                        this.MessageBar.addMessage("error", { id: errorMessageId, text: response.errorMessage, actions: [], closable: true });
                        return;
                    }
                    DialogService.show('saveAsSubscription', {
                        data: {
                            contextApp: this,
                            messageContext: this.MessageContext
                        }
                    });
                },
                context: this,
                async: false
            });
        },

        copySelectedMessage: function() {
            var context = {
                data: {
                    messageId: this.MessageContext.get('messageId'),
                    messageName: this.MessageContext.get('messageName')
                },
                messageContext: this.MessageContext,
                aborted: false
            };

            sitecore.Pipelines.CopyToDraft.execute(context);
        }
    });

    return messageBase;
});