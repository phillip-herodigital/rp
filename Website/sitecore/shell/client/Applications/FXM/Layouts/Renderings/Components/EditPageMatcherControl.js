define(["sitecore", "/-/speak/v1/assets/q.js"], function (_sc, Q) {
    _sc.Factories.createBaseComponent({

        name: "EditPageMatcherControl",
        base: "BlockBase",
        selector: ".sc-EditPageMatcherControl",

        attributes: [
            { name: "tabControl", defaultValue: "", value: "$el.data:sc-tabControl" },
            { name: "item", defaultValue: {}, value: "$el.data:sc-item" },
            { name: "nameControlId", defaultValue: "", value: "$el.data:sc-Namecontrolid" },
            { name: "urlControlId", defaultValue: "", value: "$el.data:sc-Urlcontrolid" },
            { name: "campaignsPickerControlId", defaultValue: "", value: "$el.data:sc-campaignspickercontrolid" },
            { name: "eventsPickerControlId", defaultValue: "", value: "$el.data:sc-eventspickercontrolid" },
            { name: "goalsPickerControlId", defaultValue: "", value: "$el.data:sc-goalspickercontrolid" },
            { name: "profilesPickerControlId", defaultValue: "", value: "$el.data:sc-profilespickercontrolid" },
            { name: "thisPageOnlyRadioControlId", defaultValue: "", value: "$el.data:sc-Thispageonlyradiocontrolid" },
            { name: "thisPageWithChildrenRadioControlId", defaultValue: "", value: "$el.data:sc-Thispagewithchildrenradiocontrolid" },
            { name: "customRadioControlId", defaultValue: "", value: "$el.data:sc-Customradiocontrolid" },
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

        urlControl: function () {
            return this.app[this.model.get("urlControlId")];
        },

        thisPageOnlyRadioControl: function () {
            return this.app[this.model.get("thisPageOnlyRadioControlId")];
        },

        thisPageWithChildrenRadioControl: function () {
            return this.app[this.model.get("thisPageWithChildrenRadioControlId")];
        },

        customRadioControl: function () {
            return this.app[this.model.get("customRadioControlId")];
        },

        allRadioControls: function() {
            return [this.thisPageOnlyRadioControl(), this.thisPageWithChildrenRadioControl(), this.customRadioControl()];
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

        profilesPickerControl: function () {
            return this.app[this.model.get("profilesPickerControlId")];
        },

        initialize: function (options) {
            this._super();

            this.currentMatcher = {};

            this.model.on("show", this.show, this);
            this.model.on("hide", this.hide, this);
            this.model.on("save", this.save, this);

            this.model.on("change:item", this.itemChanged, this);

            _sc.on('pagematcher:customrule', this.customRuleDialog, this);

            this.model.on('change:isEnabled', this.toggleEnabled, this);

            this.campaignsPickerControl().viewModel.selectedItemsControl().on('change:items', function (data) {
                this.setMatcherListField('CampaignIds', data);
            }, this);

            this.eventsPickerControl().viewModel.selectedItemsControl().on('change:items', function (data) {
                this.setMatcherListField('EventIds', data);
            }, this);

            this.goalsPickerControl().viewModel.selectedItemsControl().on('change:items', function (data) {
                this.setMatcherListField('GoalIds', data);
            }, this);

            this.profilesPickerControl().viewModel.selectedItemsControl().on('change:items', function (data) {
                this.setMatcherListField('ProfileIds', data);
            }, this);

            // listen to change events on sub controls
            var subEventListeners = {
                'change:text': [this.nameControl(), this.urlControl()],
                'change:isChecked': this.allRadioControls()
            }

            var self = this;
            _.each(_.keys(subEventListeners), function (key) {
                _.each(subEventListeners[key], function (entry) {
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

        setChanges: function () {
            var populating = this.model.get('populating');
            if (!populating) {
                this.model.set('hasChanges', true);
            }
        },

        toggleEnabled: function () {
            var controls = this.allRadioControls().concat([
                this.nameControl(),
                this.urlControl()
            ]);

            var state = this.model.get('isEnabled');
            _.each(controls, function (ctrl) {
                if (ctrl) {
                    ctrl.set('isEnabled', state);
                }
            });
        },

        save: function () {

            this.currentMatcher.Name = this.nameControl().get("text");

            this.currentMatcher.MatchRuleType = this.getSelectedMatchType() || 0;

            if (this.currentMatcher.MatchRuleType === "3") {
                this.currentMatcher.RuleFinalValue = this.currentMatcher.RuleXmlValue;
            } else {
                this.currentMatcher.RuleFinalValue = this.urlControl().get("text");
            }

            var self = this;
            if (this.currentMatcher.isValid()) {
                this.currentMatcher.save()
                    .then(function () {
                        self.model.set('hasChanges', false);
                        self.model.trigger("saved", self);
                    }).fail(function (err) {
                        self.model.trigger("saveerror", self);
                    });
            }
        },

        itemChanged: function () {
            this.currentMatcher = this.model.get("item");
            this.populate();
        },

        getSelectedMatchType: function () {

            var result = 0;

            _.each(this.allRadioControls(), function (control) {
                var isSelected = control.get("isChecked");

                if (isSelected) {
                    result = control.get("value");
                }
            });

            return result;
        },

        setMatcherListField: function (field, listControl) {
            var list = this.currentMatcher[field];
            list.length = 0; // clear()
            _.each(listControl.get('items'), function (entry) {
                if (list.indexOf(entry.itemId) < 0) {
                    list.push(entry.itemId);
                }
            });
            this.setChanges();
        },

        customRuleDialog: function () {
            var self = this;

            this.app.CustomRadioButton.check();

            var context = {
                data: {
                    itemId: self.model.get("item").Id,
                    database: self.model.get("item").Database || "master",
                    field: "Matcher Rule",
                    initValue: self.model.get("item").RuleXmlValue
                },
                complete: $.proxy(function (data) {
                    if (data) {
                        self.model.get("item").RuleXmlValue = data;
                    }
                }, self)
            };

            _sc.Pipelines.OpenRulesEditor.execute(context);
        },

        populateAnalyticsItemPicker: function(control, idList) {

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
            var nameControl = this.nameControl();

            if (nameControl !== undefined) {
                nameControl.set("text", this.currentMatcher.Name);
            }

            var urlControl = this.urlControl();

            if (urlControl !== undefined) {
                urlControl.set("text", this.currentMatcher.RuleFinalValue);
            }

            var thisPageOnlyRadioControl = this.thisPageOnlyRadioControl();

            if (thisPageOnlyRadioControl !== undefined) {
                if (this.currentMatcher.MatchRuleType.toString() === thisPageOnlyRadioControl.get("value")) {
                    thisPageOnlyRadioControl.set("isChecked", true);
                }
            }

            var thisPageWithChildrenRadioControl = this.thisPageWithChildrenRadioControl();

            if (thisPageWithChildrenRadioControl !== undefined) {
                if (this.currentMatcher.MatchRuleType.toString() === thisPageWithChildrenRadioControl.get("value")) {
                    thisPageWithChildrenRadioControl.set("isChecked", true);
                }
            }

            var customRadioControl = this.customRadioControl();

            if (customRadioControl !== undefined) {
                if (this.currentMatcher.MatchRuleType.toString() === customRadioControl.get("value")) {
                    customRadioControl.set("isChecked", true);
                    urlControl.set("text", "");
                    urlControl.set("isEnabled", "false");
                }
            }

            if (this.currentMatcher != undefined) {
                this.populateAnalyticsItemPicker(this.campaignsPickerControl(), this.currentMatcher.CampaignIds.underlying);
                this.populateAnalyticsItemPicker(this.goalsPickerControl(), this.currentMatcher.GoalIds.underlying);
                this.populateAnalyticsItemPicker(this.eventsPickerControl(), this.currentMatcher.EventIds.underlying);
                this.populateAnalyticsItemPicker(this.profilesPickerControl(), this.currentMatcher.ProfileIds.underlying);
            }
            this.model.set('hasChanges', false);
            this.model.set('populating', false);
        }
    });
});
