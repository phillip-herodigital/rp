// TODO: Re-factor to use DialogBase
define([
    "sitecore",
    'jquery',
    "/-/speak/v1/ecm/guidGenerator.js",
    "/-/speak/v1/ecm/DialogService.js",
    "/-/speak/v1/ecm/DialogBase.js"
], function(
    sitecore,
    $,
    guidGenerator,
    DialogService,
    DialogBase
) {
    return DialogBase.extend({
        initialized: function() {
            this._super();
            this.defaults.notify = true;
            this.defaults.listDestination = "/sitecore/system/List Manager/All Lists";
            this.ListDestinationButtonTextBox.set("text", this.defaults.listDestination);

            this.on({
                "list:select:destination": this.showSelectDestinationDialog
            }, this);
        },

        ok: function() {
            this.Ok.viewModel.disable();
            this.addList()
                .done(_.bind(function(listId) {
                    this.onAddListDone(listId);
                }, this));
        },

        validateFields: function() {
            if (!this.ListNameTextBox.get("text")) {
                this.showError({
                    id: "listNameIsEmpty",
                    Message: sitecore.Resources.Dictionary.translate("ECM.Recipients.AddEmptyRecipientList")
                });
                return false;
            }
            return true;
        },

        addList: function() {
            var listName = this.ListNameTextBox.get("text"),
                defer = $.Deferred();

            if (this.validateFields()) {
                var listId = guidGenerator.getGuid();

                $.ajax({
                    url: "/sitecore/api/ssc/ListManagement/ContactList",
                    data: {
                        Id: listId,
                        Name: listName,
                        Owner: "",
                        Description: this.ListDescriptionTextArea.get("text"),
                        Destination: this.ListDestinationButtonTextBox.get("text"),
                        Type: "Contact list",
                        Source: "{\"IncludedLists\":[" + (this.existingList ? JSON.stringify(this.existingList) : "") + "],\"ExcludedLists\":[]}"
                    },
                    error: function(jqXHR) {
                        defer.reject(jqXHR);
                    },
                    success: function() {
                        defer.resolve(listId);
                    },
                    type: "POST"
                });
            } else {
                this.Ok.viewModel.enable();
                defer.reject();
            }

            return defer.promise();
        },

        showDialog: function(options) {
            this._super(options);

            var setFocus = _.bind(function() {
                if (this.ListNameTextBox.viewModel.$el.is(':visible')) {
                    this.ListNameTextBox.viewModel.$el.focus();
                } else
                    setTimeout(setFocus, 100);
            }, this);
            setTimeout(setFocus, 100);
            // bootstrap dialog set focus on the div after showing, so we need also handle focus on div not to loose focus
            this.DialogWindow.viewModel.$el.focus(setFocus);
        },

        notify: function() {
            sitecore.trigger("listManager:listCreated");
        },

        showSelectDestinationDialog: function() {
            this.resetMessageBar();
            this.detachHandlers();
            this.DialogWindow.hide();
            var callback = _.bind(function(itemId, item) {
                if (typeof item != "undefined" && item != null) {
                    this.ListDestinationButtonTextBox.set("text", (item.$path));
                } else {
                    this.ListDestinationButtonTextBox.set("text", this.defaults.listDestination);
                }
            }, this);
            DialogService.get('selectFolder')
                .done(_.bind(function(dialog) {
                    $(document).on('hidden.bs.modal.exm', '[data-sc-id=SelectFolderDialog]', _.bind(function () {
                        // jQuery able to catch the namespaced event only on the first trigger. To fix it need to use delegation
                        $(document).off('hidden.bs.modal.exm');
                        this.DialogWindow.show();
                        this.attachHandlers();
                    }, this));

                    dialog.SelectFolderDialog.set("backdrop", "static");
                    dialog.showDialog({
                        callback: callback,
                        rootId: "{BC799B34-8423-48AC-A2FE-D128E6300659}",
                        selectedItemId: this.ListDestinationButtonTextBox.get("text")
                    });
                }, this));
        },

        resetMessageBar: function() {
            this.MessageBar.removeMessage(function(error) { return error.id === "listNameIsEmpty"; });
        },

        resetDefaults: function() {
            this._super();
            this.resetMessageBar();
            this.ListDescriptionTextArea.set("text", "");
            this.ListNameTextBox.set("text", "");
            this.ListDestinationButtonTextBox.set("text", this.defaults.listDestination);
            this.Ok.viewModel.enable();
        },

        onAddListDone: function(listId) {
            if (this.options.data) {
                this.options.on.ok(this.options.data.messageId, listId, this.options.data.recipientListType);
            }
            this.hideDialog();
            this.resetDefaults();
            if (this.options.notify) {
                this.notify();
            }
        }

    });
});