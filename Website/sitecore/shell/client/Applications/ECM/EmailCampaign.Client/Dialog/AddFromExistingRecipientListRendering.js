define([
    "sitecore",
    "/-/speak/v1/ecm/guidGenerator.js",
    "/-/speak/v1/listmanager/SelectLists.js",
    "/-/speak/v1/ecm/AddEmptyRecipientListRendering.js",
    "/-/speak/v1/ecm/DialogService.js"
], function(
    sitecore,
    guidGenerator,
    selectLists,
    AddEmptyRecipientListRendering,
    DialogService
) {
    return AddEmptyRecipientListRendering.extend({
        initialized: function() {
            this._super();

            selectLists.init(this);

            this.on({
                'list:select:list': this.showSelectListDialog
            }, this);
        },

        validateFields: function() {
            var selectList = this.ListSelectListButtonTextBox.get("text");
            if (!selectList) {
                this.showError({
                    id: "existinglistIsEmpty",
                    Message: sitecore.Resources.Dictionary.translate("ECM.Recipients.NoExistingListSelected")
                });
                return false;
            }
            return this._super();
        },

        showSelectListDialog: function() {
            this.resetMessageBar();
            this.detachHandlers();
            this.DialogWindow.hide();
            var callback = _.bind(function(itemId, item) {
                if (typeof item != "undefined" && item != null) {
                    this.ListSelectListButtonTextBox.set("text", (item.Name));
                    this.existingList = item;
                }
            }, this);

            DialogService.get('selectList')
                .done(_.bind(function(dialog) {
                    $(document).on('hidden.bs.modal.exm', '[data-sc-id=SelectContactListsDialog]', _.bind(function() {
                        // jQuery able to catch the namespaced event only on the first trigger. To fix it need to use delegation
                        $(document).off('hidden.bs.modal.exm');
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

        resetMessageBar: function() {
            this._super();
            this.MessageBar.removeMessage(function(error) { return error.id === "existinglistIsEmpty"; });
        },

        notify: function() {},

        resetDefaults: function() {
            this._super();
            this.ListSelectListButtonTextBox.set("text", "");
        }
    });
});