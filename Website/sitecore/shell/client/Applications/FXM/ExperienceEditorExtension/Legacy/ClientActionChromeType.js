define([
    "sitecore",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/Fxm.js"
], function (_sc, _scl, $sc, _fxm) {

    // utilities
    var TRACKING_FIELD = "{B0A67B2A-8B07-4E0B-8809-69F751709806}";
    var FINAL_LAYOUT_FIELD = "{04BF00DB-F5FB-41F7-8AB7-22408372A981}";
    var getItemUri = function(chrome) {
        return new _scl.ItemUri(chrome.element.attr('data-sc-id'), _scl.PageModes.PageEditor.language(), chrome.element.attr('data-sc-version'), chrome.element.attr('data-sc-revision'));
    }
    
    var runTrackingPipeline =  function(chrome, pipeline) {
        var context = {
            data: {
                itemId: chrome.element.attr('data-sc-id'),
                database: "master",
                initValue: _scl.PageModes.ChromeManager.getFieldValue(getItemUri(chrome), TRACKING_FIELD)
            },
            complete: $.proxy(function (data) {
                if (data) {

                    var initialValue = _scl.PageModes.ChromeManager.getFieldValue(getItemUri(chrome), TRACKING_FIELD);

                    _scl.PageModes.ChromeManager.setFieldValue(getItemUri(chrome), TRACKING_FIELD, data);

                    if (initialValue === null) {
                        initialValue = "";
                    }

                    if (data.toLowerCase() != initialValue.toLowerCase()) {
                        var message = _sc.ExperienceEditor.instance.TranslationDictionary.translate("Your FXM function has unsaved changes to it. Please save your changes.");

                        var actionMessage = "";
                        var actionClick = "";

                        _sc.ExperienceEditor.instance.NotificationBar.addMessage("notification", {
                            text: message,
                            closable: false,
                            actions: [{
                                text: actionMessage,
                                action: actionClick
                            }]
                        });

                        _sc.ExperienceEditor.instance.setHeight();
                    }
                }
            }, this)
        }
        pipeline.execute(context);
    }

    // implementation
    _scl.PageModes.ChromeTypes.ClientAction = _scl.PageModes.ChromeTypes.Placeholder.extend({

        elements: function (domElement) {
            if (!domElement.is("code[type='text/sitecore'][chromeType='" +  _fxm.clientActionKey +"']")) {
                console.error("Unexpected domElement passed to Fxm ClientActionChromeType for initialization:");
                console.error(domElement);

                throw "Failed to parse page editor client action demarked by script tags";
            }

            return this._getElementsBetweenScriptTags(domElement);
        },

        handleMessage: function (message, params) {
            switch(message) {
                case "chrome:placeholder:removeFxmClientAction":
                    this.removeClientAction();
                    return;
                case "chrome:placeholder:clientActionGoals":
                    runTrackingPipeline(this.chrome, _sc.Pipelines.OpenGoalsEditor);
                    return;
                case "chrome:placeholder:clientActionAttributes":
                    runTrackingPipeline(this.chrome, _sc.Pipelines.OpenAttributesEditor);
                    return;
            }

            this.base(message, params);
        },

        key: function () {
            return _fxm.clientActionKey;
        },

        isEmpty: function () {
            return this.chrome.element.length === 0;
        },

        removeClientAction: function () {
            if (!this.chrome || !this.chrome.element) {
                return;
            }

            var placehoderOpenCode = this.chrome.element.prevAll("code[chrometype=placeholder][kind=open]").eq(0);
            if (!placehoderOpenCode) {
                return;
            }

            var key = placehoderOpenCode.attr("key");
            var content = $sc("[placeholderkey=" + key + "]");
            if (content) {
                var display = content.attr("displayAttr");
                content.css("display", display);
                content.removeAttr("dynamic");
                content.removeAttr("displayAttr");
                content.removeAttr("wasselected");
                content.removeAttr("placeholderkey");
            }

            var itemUri = getItemUri(this.chrome);
            _scl.PageModes.ChromeManager.setFieldValue(itemUri, FINAL_LAYOUT_FIELD, 'delete');

            if (this.chrome) {
                _scl.PageModes.ChromeManager.hideSelection();

                this.chrome.remove();
                _scl.PageModes.ChromeManager.resetChromes();
            }
        },

        remove: function(chrome) {
            chrome.onDelete();
            chrome.detachEvents();
            chrome.detachElements();
            chrome.openingMarker().remove();
            chrome.closingMarker().remove();
            chrome.element.next('code[chrometype=' + chrome.key() + ']').remove();
            chrome.element.prev('code[chrometype=' + chrome.key() + ']').remove();
            chrome.element.removeClass('scEmptySelector');
            chrome.element.removeClass('scEnabledChrome');
            chrome.element.removeAttr('sc-selector-id');
            chrome.element.removeAttr('sc-part-of');
            chrome._removed = true;
            _scl.PageModes.ChromeManager._chromes = $sc.grep(_scl.PageModes.ChromeManager._chromes, function (value) {
                return value.element !== chrome.element;
            });
        }
    });
});
