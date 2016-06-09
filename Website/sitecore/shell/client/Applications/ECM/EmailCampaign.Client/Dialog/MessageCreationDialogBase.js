define([
    "sitecore",
    "/-/speak/v1/ecm/Validation.js",
    "/-/speak/v1/ecm/DialogBase.js",
    "/-/speak/v1/ecm/MessageCreationService.js"
], function(
    sitecore,
    Validation,
    DialogBase,
    MessageCreationService
) {
    return DialogBase.extend({
        initialized: function() {
            this._super();
            this.creationInProgress = false;
            this.attachEventHandlers();
            this.DialogWindow.viewModel.$el.addClass('message-creation-dialog');
        },

        attachEventHandlers: function() {
            this.on({
                'select:existing:page:dialog:ok': this.existhideDialog,
                'select:existing:page:dialog:cancel': this.existcancelDialog,
                'selectExistingPage:browse': this.onBrowseExistingPage
            }, this);

            this.NameTextBox.on('change:invalid', this.toggleInputError);
            this.ImportNameTextBox.on('change:invalid', this.toggleInputError);
            this.Uploader.on('change:invalid', this.toggleInputError);
            this.BrowseTextBox.on('change:invalid', this.toggleInputError);

            this.NameTextBox.on({
                'change:invalid': function() {
                    this.ImportNameTextBox.set('invalid', this.NameTextBox.get('invalid'));
                },
                'change:text': function(e) {
                    this.ImportNameTextBox.set('text', this.NameTextBox.get('text'));
                }
            }, this);

            this.ImportNameTextBox.on({
                'change:invalid': function() {
                    this.NameTextBox.set('invalid', this.ImportNameTextBox.get('invalid'));
                },
                'change:text': function(e) {
                    this.NameTextBox.set('text', this.ImportNameTextBox.get('text'));
                }
            }, this);

            var inputElements = this.NameTextBox.viewModel.$el.add(this.ImportNameTextBox.viewModel.$el);
            inputElements.on('keyup', _.bind(function(e) {
                this.createByEnterKey($(e.target).val(), e);
            }, this));

            sitecore.on("create:message:click", function(data) {
                this.createMessageData = data;
                sessionStorage.createMessageParameters = JSON.stringify(this.createMessageData.parameters);

                _.defer(_.bind(this.cleanupMessageBar, this));
            }, this);
        },

        complete: function() {
            this.clearMessageCreationForm();
        },

        // need to be re-factored
        ok: function() {
            if (this.Validation.validateAll() && !this.creationInProgress) {
                this.creationInProgress = true;
                var parameters = JSON.parse(sessionStorage.createMessageParameters);
                if (!this.createMessageData || this.createMessageData.parameters.messageTemplateId !== parameters.messageTemplateId) {
                    return;
                }
                this.off("dialog:ok");
                this.createMessageData.parameters = parameters;
                this.MessageBar.removeMessages();
                var url = this.createMessageData.url;
                var position = url.lastIndexOf('/');
                var createType = url.substring(position + 1);
                this.Create.set("isEnabled", false);
                history.pushState({ path: window.location.href }, null, window.location.href);
                createType = createType.substr(0, createType.lastIndexOf('.')).toLowerCase() || createType.toLowerCase();
                switch (createType) {
                case "existingtemplate":
                    this.createExistingTemplate();
                    break;
                case "existingpage":
                    this.createExistingPage();
                    break;
                case "importhtml":
                    this.createImportHtml();
                    break;
                default:
                    break;
                }
            }
        },

        onBrowseExistingPage: function() {
            var selectedPagePath = this.BrowseTextBox.get("text");
            if (selectedPagePath) {
                if (selectedPagePath[selectedPagePath.length - 1] === "/") {
                    selectedPagePath = selectedPagePath.substring(0, selectedPagePath.length - 1);
                }
                var arr = selectedPagePath.split("/");
                var selectedLink = this.ExistingPageTreeView.viewModel.$el.find("a.dynatree-title:contains('" + arr[arr.length - 1] + "')");
                selectedLink.click();
            }
            this.detachHandlers();
            this.DialogWindow.hide();
            this.showExistingPageDialog();
        },

        showExistingPageDialog: function() {
            this.SelectExistingPageDialogWindow.show();
            this.SelectExistingPageDialogWindow.viewModel.$el.on('hide.bs.modal.exm', _.bind(function() {
                _.defer(_.bind(function() {
                    this.DialogWindow.show();
                    this.attachHandlers();
                }, this));
                this.SelectExistingPageDialogWindow.viewModel.$el.off('hide.bs.modal.exm');
            }, this));
        },

        cleanupMessageBar: function() {
            this.MessageBar.removeMessage(function(err) {
                return !err.id;
            });
            if (this.BrowseTextBox.viewModel.$el.is(':hidden')) {
                this.Validation.removeError(this.Validation.getMessageId(this.BrowseTextBox.get('name')), this.BrowseTextBox);
            }
            if (this.Uploader.viewModel.$el.is(':hidden')) {
                this.Validation.removeError(this.Validation.getMessageId(this.Uploader.get('name')), this.Uploader);
            }
            // Workaround for server errors and file extension validators, when switching between message types
            this.Create.set('isEnabled', !this.MessageBar.get("hasMessages"));
        },

        setupValidation: function(nameExpression) {
            if (this.Validation) {
                this.Validation.destroy();
            }

            this.Validation = Validation.create({
                    id: 'MessageCreationDialog',
                    skip: ':hidden',
                    highlightInput: false,
                    inputs: [
                        {
                            input: this.NameTextBox,
                            trim: true,
                            validators: {
                                nameIsValid: {
                                    params: {
                                        expression: nameExpression
                                    }
                                }
                            }
                        },
                        {
                            input: this.ImportNameTextBox,
                            trim: true,
                            validators: {
                                nameIsValid: {
                                    params: {
                                        expression: nameExpression
                                    }
                                }
                            }
                        },
                        {
                            input: this.BrowseTextBox,
                            validators: {
                                trimRequired: {
                                    message: sitecore.Resources.Dictionary.translate('ECM.Pipeline.AddPreExstingPage.NotSelectExistingPage')
                                }
                            }
                        },
                        {
                            input: this.Uploader,
                            validateEvent: 'change:totalFiles',
                            valueProp: 'totalFiles',
                            validators: {
                                numMin: {
                                    params: {
                                        min: 1
                                    },
                                    message: sitecore.Resources.Dictionary.translate("ECM.Pipeline.ImportHtmlLayout.NotImportHtml")
                                },
                                numMax: {
                                    params: {
                                        max: 1
                                    },
                                    message: sitecore.Resources.Dictionary.translate("ECM.Pipeline.ImportHtmlLayout.OneHtmlOnly")
                                }
                            }
                        }
                    ]
                })
                .on({
                    'validation:input:error': function(message, input) {
                        input.set('invalid', true);
                        this.MessageBar.removeMessage(function(mess) {
                            return mess.id ? mess.id === message.id : false;
                        });
                        this.MessageBar.addMessage("error", _.extend({ actions: [], closable: true }, message));
                    },
                    'validation:input:success': function(message, input) {
                        input.set('invalid', false);
                        this.MessageBar.removeMessage(function(mess) {
                            return mess.id ? mess.id.indexOf(message.id) > -1 : false;
                        });
                    },
                    'change:valid': function() {
                        this.Create.set('isEnabled', this.Validation.get('valid'));
                    }
                }, this);
        },

        toggleInputError: function() {
            this.viewModel.$el.parent()[this.get('invalid') ? 'addClass' : 'removeClass']("has-error");
        },

        getMessageData: function() {
            return {
                messageTemplateId: this.createMessageData.parameters.messageTemplateId,
                managerRootId: sessionStorage.managerRootId,
                messageName: _.escape(this.NameTextBox.get("text")),
                messageTypeTemplateId: this.createMessageData.parameters.messageTypeTemplateId
            }
        },

        createExistingTemplate: function() {
            MessageCreationService.create('new', this.getMessageData());
        },

        createExistingPage: function() {
            var data = this.getMessageData(),
                options = {
                    on: {
                        error: _.bind(function(response) {
                            if (response.error) {
                                this.MessageBar.addMessage("error", { text: response.errorMessage, closable: true, actions: [] });
                                response.error = null;
                                response.errorMessage = null;
                            }
                        }, this)
                    }
                };
            data.existingMessagePath = this.BrowseTextBox.get("text");
            data.databaseName = "master";
            MessageCreationService.create('existingPage', data, null, options);
        },

        createNewMessage: function(file) {
            var data = this.getMessageData();
            data.fileItemId = file.itemId;
            data.fileName = file.data.name;
            data.database = this.Uploader.viewModel.$el.data("sc-databasename");
            var result = MessageCreationService.create('importHtml', data);
            if (!result) {
                this.UploaderInfo.viewModel.$el.find("div.sc-uploaderInfo-row").parent().remove();
            }
        },

        createImportHtml: function() {
            if (this.UploaderInfo.viewModel.files()[0].type() !== 'text/html') {
                var notHtmlFile = { id: "MessageCreationDialog-" + this.Uploader.get('name'), text: sitecore.Resources.Dictionary.translate("ECM.Pipeline.ImportHtmlLayout.NotHtmlFile"), actions: [], closable: true };
                this.MessageBar.addMessage("error", notHtmlFile);
                this.on("dialog:ok", this.ok, this);
                this.creationInProgress = false;
            } else {
                this.on("upload-fileUploaded", this.createNewMessage, this);
                this.Uploader.viewModel.upload();
            }
        },

        showDialog: function(options) {
            this._super(options);

            if (!options.data || options.data.createMessageOptions.length < 1) {
                return;
            }

            this.CreateMessage.set("dataSourceValue", options.data.createMessageOptions);
            this.CreateMessage.set("itemNameValidation", options.data.nameValidationExpression);
            this.CreateMessage.viewModel.renderDataSource();
            this.setupValidation(options.data.nameValidationExpression);
            this.clearMessageCreationForm();
            this.Create.set('isEnabled', true);
            this.creationInProgress = false;
        },

        existhideDialog: function() {
            var selectItem = this.ExistingPageTreeView.viewModel.getActiveNode();
            this.BrowseTextBox.set("text", selectItem.data.path);
            this.SelectExistingPageDialogWindow.hide();

            this.DialogWindow.show();
            this.attachHandlers();
            this.setControlsProperties(
                ['ImportNameLabel', 'ImportNameTextBox', 'BrowseNameLabel', 'BrowseTextBox'],
                { isVisible: true }
            );
        },

        existcancelDialog: function() {
            this.SelectExistingPageDialogWindow.hide();
            this.DialogWindow.show();
            this.attachHandlers();
        },

        clearMessageCreationForm: function() {
            this.setControlsProperties(
                ['NameLabel', 'NameTextBox', 'ImportNameLabel', 'ImportNameTextBox', 'BrowseNameLabel', 'BrowseTextBox'],
                { isVisible: false },
                ['NameTextBox', 'ImportNameTextBox', 'BrowseTextBox'],
                { text: '' }
            );
            this.MessageBar.removeMessages();
            $("[data-sc-id=UploaderRowPanel]").hide();
        },

        isCreateMessageAlreadyClicked: function(value) {
            var result = false;
            if (!sessionStorage.createMessageName) {
                sessionStorage.createMessageName = value;
            } else {
                if (sessionStorage.createMessageName === value) {
                    result = true;
                }
            }
            return result;
        },

        createByEnterKey: function(value, e) {
            if (e.keyCode === 13 && this.Create.get("isEnabled")) {
                this.Create.set("isEnabled", false);
                if (this.isCreateMessageAlreadyClicked(value)) {
                    return;
                }
                this.trigger("dialog:ok");
                sessionStorage.removeItem("createMessageName");
            }
        }
    });
});