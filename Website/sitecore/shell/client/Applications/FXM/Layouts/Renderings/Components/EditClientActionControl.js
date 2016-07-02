define(["sitecore"], function (_sc) {
    _sc.Factories.createBaseComponent({

        name: "EditClientActionControl",
        base: "BlockBase",
        selector: ".sc-EditClientActionControl",

        attributes: [
            { name: "tabControl", defaultValue: "", value: "$el.data:sc-tabControl" },
            { name: "item", defaultValue: {}, value: "$el.data:sc-item" },
            { name: "nameControlId", defaultValue: "", value: "$el.data:sc-Namecontrolid" },
            { name: "campaignsPickerControlId", defaultValue: "", value: "$el.data:sc-campaignspickercontrolid" },
            { name: "eventsPickerControlId", defaultValue: "", value: "$el.data:sc-eventspickercontrolid" },
            { name: "goalsPickerControlId", defaultValue: "", value: "$el.data:sc-goalspickercontrolid" },
            { name: "hasChanges", defaultValue: false },
            { name: "isEnabled", defaultValue: true }
        ],

        extendModel: {
            show: function () {
                this.trigger("show");
            },
            hide: function () {
                this.trigger("hide");
            },
            saveItem: function () {
                this.trigger("save");
            }
        },

        nameControl: function () {
            return this.app[this.model.get("nameControlId")];
        },

        goalsPickerControl: function () {
            return this.app[this.model.get("goalsPickerControlId")];
        },

        eventsPickerControl: function () {
            return this.app[this.model.get("eventsPickerControlId")];
        },

        campaignsPickerControl: function () {
            return this.app[this.model.get("campaignsPickerControlId")];
        },

        initialize: function () {
            this._super();

            this.model.on("show", this.show, this);
            this.model.on("hide", this.hide, this);
            this.model.on("save", this.save, this);

            this.model.on("change:item", this.itemChanged, this);

            this.model.on('change:isEnabled', this.toggleEnabled, this);

            // listen to change events on sub controls
            var subEventListeners = {
                'change:text': [this.nameControl()],
                'change:items': [this.goalsPickerControl(), this.eventsPickerControl(), this.campaignsPickerControl()]
            }

            var self = this;
            _.each(_.keys(subEventListeners), function(key) {
                _.each(subEventListeners[key], function(entry) {
                    if (!!entry) {
                        entry.on(key, self.setChanges, self);
                    }
                });
            });
        },

        show: function () {
            this.$el.show();
        },

        hide: function () {
            this.$el.hide();
        },

        save: function () {
            var item = this.model.get("item");

            item.Name = this.nameControl().get("text");
            item.CampaignIds = this.campaignsPickerControl().viewModel.selectedItemsControl().get("items").map(function (i) { return i.itemId; });
            item.GoalIds = this.goalsPickerControl().viewModel.selectedItemsControl().get("items").map(function (i) { return i.itemId; });
            item.EventIds = this.eventsPickerControl().viewModel.selectedItemsControl().get("items").map(function (i) { return i.itemId; });

            var self = this;

            if (item.isValid()) {
                item.save()
                    .then(function () {
                        self.model.set('hasChanges', false);
                        self.model.trigger("saved", self);
                    }).fail(function(err) {
                        self.model.trigger("saveerror", self);
                    });
            }
        },

        itemChanged: function () {
            this.populate();
        },

        setChanges: function() {
            var populating = this.model.get('populating');
            if (!populating) {
                this.model.set('hasChanges', true);
            }
        },

        toggleEnabled: function() {
            var controls = [
                this.goalsPickerControl(),
                this.eventsPickerControl(),
                this.campaignsPickerControl(),
                this.nameControl()
            ];

            var state = this.model.get('isEnabled');
            _.each(controls, function (ctrl) {
                if (ctrl) {
                    ctrl.set('isEnabled', state);
                }
            });
        },

        populateAnalyticsItemPicker: function (control, idList) {

            if (control !== undefined && idList !== undefined) {

                var selectedItems = [];

                _.each(idList, function (itemId) {
                    var item = control.viewModel.findItemById(itemId);

                    if (item !== undefined) {
                        selectedItems.push(item);
                    }
                });

                control.viewModel.selectedItemsControl().set("items", selectedItems);
            }
        },

        populate: function () {
            this.model.set('populating', true);

            var item = this.model.get("item");

            var nameControl = this.nameControl();

            if (nameControl !== undefined && item !== undefined) {
                nameControl.set("text", item.Name);
            }

            if (item != undefined) {
                this.populateAnalyticsItemPicker(this.campaignsPickerControl(), item.CampaignIds.underlying);
                this.populateAnalyticsItemPicker(this.goalsPickerControl(), item.GoalIds.underlying);
                this.populateAnalyticsItemPicker(this.eventsPickerControl(), item.EventIds.underlying);
            }
            
            this.model.set('hasChanges', false);
            this.model.set('populating', false);
        }
    });
});
