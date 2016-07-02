define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Utils/ClientBeacon.js",
    "/-/speak/v1/FXM/Validation.js",
    "/-/speak/v1/FXM/ItemServiceUtil.js"
], function (_sc, _clientBeacon, _validator, _service) {
    return _sc.Definitions.App.extend({
        initialized: function () {
            this.queryString = _sc.Helpers.url.getQueryParameters(location.href);
            this.elementReplacerValidator = new _validator(this.MessageBarDataSource, this.ElementReplacerMessageBar);
            this.selectorPath = this.queryString.selector;
            this.position = this.queryString.position;
            this.ParentTreeview.set('whitelist', this.getWhiteList());
            this.ParentTreeview.set('rootItemId', this.getRoot());

            this.on("button:cancel", function () {
                this.closeDialog(null);
            }, this);

            this.on("button:ok", function() {
                this.save();
            }, this);
        },

        getRoot: function() {
            var domainItem = _clientBeacon.domainItem();
            if (domainItem) {
                return domainItem;
            }

            return this.queryString.root;
        },

        getWhiteList: function() {
            var children = _clientBeacon.matchers();
            if (children.length > 0) {
                return jQuery.makeArray(children);
            }

            children = this.queryString.children;
            if (children) {
                return children.split(',');
            }

            return [];
        },

        save: function () {
            var item = {
                ItemName: this.NameTextbox.get('text'),
                TemplateID: '{10E23679-55DB-4059-B8F2-E417A2F78FCB}',
				Position: this.position,
                Selector: this.selectorPath
            };
            var self = this;

            this.elementReplacerValidator.clear();

            var parent = this.ParentTreeview.get('selectedItemPath');
            if (!parent) {
                this.elementReplacerValidator.showMessageById('{45B2AE8E-26E3-4D69-B691-1FCFABFBEFF4}');
            }

            if (!item.ItemName) {
                this.elementReplacerValidator.showMessageById('{CF2E08CA-61B8-4AF5-87DC-110EA7F1D254}');
            }

            if (this.elementReplacerValidator.hasMessages()) {
                return;
            }

            parent = parent.substring(0, parent.lastIndexOf('/') + 1) + this.ParentTreeview.get('selectedItemId');
            _service.create(item, parent)
                .then(function (data) {
                    _service.fetchItem(data.ItemID)
                        .then(function(instance) {
                            self.closeDialog(instance);
                        });
                })
                .fail(function (err) {
                    self.elementReplacerValidator.showMessageById('{1C2ECBD3-B2AA-4ED0-8CA1-139BFE787529}', err.message);
                });
        }
    });
});
