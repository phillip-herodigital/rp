define([
    "sitecore",
    "/-/speak/v1/listmanager/SelectLists.js",
    "/-/speak/v1/ecm/ServerRequest.js",
    "/-/speak/v1/ecm/DialogService.js",
    "/-/speak/v1/ecm/Validation.js",
    "/-/speak/v1/ecm/DialogBase.js",
    "/-/speak/v1/ecm/ManagerRootService.js",
    "/-/speak/v1/ecm/constants.js"
], function(
    sitecore,
    selectLists,
    ServerRequest,
    DialogService,
    Validation,
    DialogBase,
    ManagerRootService,
    Constants
) {
    return DialogBase.extend({
        initialized: function() {
            this._super();
            this.on("default:settings:select:globaloptoutlist", this.selectGlobalOptOutList, this);
            sitecore.on("default:settings:dialog:firstrun", this.firstrun, this);

            this.globalOptOutListId = null;
            this.setupValidation();
        },

        setupValidation: function() {
            this.Validation = Validation.create({
                id: 'DefaultSettings',
                inputs: [
                    {
                        input: this.BaseUrlTextBox,
                        validators: {
                            required: {
                                message: sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.BaseUrlRequired")
                            },
                            url: {
                                message: sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.BaseUrlNotValid")
                            }
                        }
                    },
                    {
                        input: this.PreviewBaseUrlTextBox,
                        optional: true,
                        validators: {
                            url: {
                                message: sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.PreviewBaseUrlNotValid")
                            }
                        }
                    },
                    {
                        input: this.FromAddressTextBox,
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
                        input: this.ReplyToTextBox,
                        optional: true,
                        validators: {
                            email: {
                                message: sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.ReplyToNotValid")
                            }
                        }
                    },
                    {
                        input: [this.FromAddressTextBox, this.FromNameTextBox],
                        validators: {
                            summaryMax: {
                                message: sitecore.Resources.Dictionary.translate("ECM.Pipeline.Validate.FromNamePlusFromAddressIsToLong"),
                                params: {
                                    max: 254
                                }
                            }
                        }
                    }
                ]
            }).on({
                'validation:input:error': function(message) {
                    this.MessageBar.removeMessage(function(mess) { return mess.id ? mess.id === message.id : false; });
                    this.MessageBar.addMessage("error", _.extend({ actions: [], closable: true }, message));
                },
                'validation:input:success': function(message) {
                    this.MessageBar.removeMessage(function(mess) { return mess.id ? mess.id.indexOf(message.id) > -1 : false; });
                },
                'change:valid': function() {
                    this.OK.set("isEnabled", this.Validation.get('valid'));
                }
            }, this);
        },

        showDialog: function(options) {
            this.refresh();
            this._super(options);
        },

        selectGlobalOptOutList: function() {
            this.detachHandlers();
            this.DialogWindow.hide();
            var callback = _.bind(function(itemId, item) {
                if (typeof item != "undefined" && item != null) {
                    this.GlobalOptOutListTextBox.set("text", (item.Name));
                    this.globalOptOutListId = itemId;
                }
            }, this);

            DialogService.get('selectList')
                .done(_.bind(function(dialog) {
                    // jQuery able to catch the namespaced event only on the first trigger. To fix it need to use delegation
                    $(document).off('hidden.bs.modal.exm');
                    $(document).on('hidden.bs.modal.exm', '[data-sc-id=SelectContactListsDialog]', _.bind(function() {
                        this.DialogWindow.show();
                        this.attachHandlers();
                    }, this));

                    dialog.SelectContactListsDialog.set("backdrop", "static");
                    dialog.showDialog({
                        callback: callback,
                        excludelists: []
                    });
                }, this));
        },

        cancel: function() {
            var rootList = ManagerRootService.getManagerRootList();
            if (rootList.length == 0) {
                location.reload();
            }
            this._super();
        },

        serialize: function() {
            return {
                baseUrl: this.BaseUrlTextBox.get("text"),
                previewBaseUrl: this.PreviewBaseUrlTextBox.get("text"),
                fromAddress: this.FromAddressTextBox.get("text"),
                fromName: _.escape(this.FromNameTextBox.get("text")),
                replyTo: this.ReplyToTextBox.get("text"),
                globalOptOutListId: this.globalOptOutListId,
                managerRootId: sessionStorage.managerRootId
            }
        },

        isResponseValid: function(response, errorMessage) {
            var errorMessageId = errorMessage ? errorMessage.id : null;
            this.MessageBar.removeMessage(function(error) { return error.id === errorMessageId || error.id === 'serverError'; });
            if (response.error) {
                this.showError({ id: 'serverError', Message: response.errorMessage });
                return false;
            }
            if (!response.value) {
                if (errorMessage) {
                    this.showError(errorMessage);
                }
                return false;
            }
            return true;
        },

        saveSuccess: function(response) {
            if (this.isResponseValid(response)) {
                this.options.on.ok();
                this.hideDialog();
                this.resetDefaults();
            }
        },

        ok: function() {
            this.MessageBar.removeMessages();
            this.validate().done(_.bind(function() {
                ServerRequest(Constants.ServerRequests.SAVE_DEFAULT_SETTINGS, {
                    data: this.serialize(),
                    success: this.saveSuccess,
                    context: this,
                    defaultErrorMessage: {
                        id: 'SaveDefaultSettings',
                        Message: sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.NotSaved")
                    }
                });
            }, this));
        },

        canSave: function() {
            var defer = $.Deferred(),
                invalidMessage = {
                    Message: sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.DoNotHavePermission"),
                    id: 'CanSaveDefaultSettings'
                };

            ServerRequest(Constants.ServerRequests.CAN_SAVE_DEFAULT_SETTINGS, {
                data: null,
                success: function(response) {
                    if (this.isResponseValid(response, invalidMessage)) {
                        defer.resolve();
                    } else {
                        defer.reject();
                    }
                },
                error: function() {
                    defer.reject();
                },
                context: this
            });
            return defer.promise();
        },

        validate: function() {
            var defer = $.Deferred(),
                invalidMessage = {
                    Message: sitecore.Resources.Dictionary.translate("ECM.DefaultSettings.NotSaved"),
                    id: 'ValidateDefaultSettings'
                };

            this.canSave()
                .done(_.bind(function() {
                    ServerRequest(Constants.ServerRequests.VALIDATE_DEFAULT_SETTINGS, {
                        data: this.serialize(),
                        success: function(response) {
                            if (this.isResponseValid(response, invalidMessage)) {
                                defer.resolve();
                            } else {
                                this.Validation.validateAll();
                                defer.reject();
                            }
                        },
                        error: function() {
                            defer.reject();
                        },
                        context: this
                    });
                }, this));

            return defer.promise();
        },

        loadSettingsSuccess: function(response) {
            if (response.error) {
                this.MessageBar.addMessage("error", response.errorMessage);
                return;
            }
            this.BaseUrlTextBox.set("text", response.baseUrl);
            this.PreviewBaseUrlTextBox.set("text", response.previewBaseUrl);
            this.FromAddressTextBox.set("text", response.fromAddress);
            this.FromNameTextBox.set("text", response.fromName);
            this.ReplyToTextBox.set("text", response.replyTo);
            this.GlobalOptOutListTextBox.set("text", response.globalOptOutList);
            this.globalOptOutListId = response.globalOptOutListId;
        },

        refresh: function() {
            this.MessageBar.removeMessages();
            ServerRequest(Constants.ServerRequests.LOAD_DEFAULT_SETTINGS, {
                data: { value: sessionStorage.managerRootId },
                success: this.loadSettingsSuccess,
                context: this
            });
        },

        firstrun: function() {
            // check if we should show the dialog or not...
            ServerRequest(Constants.ServerRequests.FIRST_USAGE, {
                data: null,
                success: function(response) {
                    if (this.isResponseValid(response)) {
                        sessionStorage.managerRootId = response.value;
                        sessionStorage.firstrun = 1;
                        location.reload();
                    }
                },
                context: this
            });
        }
    });
});