define([
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacySitecore.js",
    "/-/speak/v1/FXM/ExperienceEditorExtension/Legacy/LegacyjQuery.js"
], function (_scl, $sc) {

    var FINAL_LAYOUT_FIELD = "{04BF00DB-F5FB-41F7-8AB7-22408372A981}";

    function removePlaceholder() {
        if (!this.chrome || !this.chrome.element) {
            return;
        }

        var placeholderOpenCode = this.chrome.element.prevAll("code[chrometype=placeholder][kind=open]").eq(0);
        if (!placeholderOpenCode) {
            return;
        }

        var key = placeholderOpenCode.attr("key");
        var content = $sc("[placeholderkey='" + key + "']");
        if (content) {
            var display = content.attr("displayAttr");
            content.css("display", display);
            content.removeAttr("dynamic");
            content.removeAttr("displayAttr");
            content.removeAttr("wasselected");
            content.removeAttr("placeholderkey");
        }

        var id = key.split('/')[0];
        var itemUri = new _scl.ItemUri(id, _scl.PageModes.PageEditor.language(), id, 1);
        _scl.PageModes.ChromeManager.setFieldValue(itemUri, FINAL_LAYOUT_FIELD, 'delete');

        if (this.chrome) {
            _scl.PageModes.ChromeManager.hideSelection();

            this.chrome.remove();
            _scl.PageModes.ChromeManager.resetChromes();
        }
    }

    function addControlResponse(id, openProperties, ds) {
        
        var options = _scl.PageModes.ChromeTypes.Placeholder.getDefaultAjaxOptions("insert");

        options.context = this;    
        options.data.rendering = id;
        options.data.placeholderKey = this.placeholderKey();
        options.data.position = this._insertPosition;
        options.data.url = window.location.href;                
    
        if (ds) {
            options.data.datasource = ds;
        }

        options.success = function(serverData) {
            var data = _scl.PageModes.Utility.parsePalleteResponse(serverData);       
            var persistedLayout;

            if (data.layout) {
                var layoutCtrl = $sc("#scLayout");
                persistedLayout = layoutCtrl.val();
                layoutCtrl.val(data.layout);          
            }

            var renderingUniqueId;

            if (data.url) {
                renderingUniqueId = $sc.parseQuery(data.url)["sc_ruid"];
            }

            _scl.PageModes.ChromeManager.hideSelection();

            if (data.url != null) {

                var self = this;

                $.ajax({
                    url: "/sitecore/api/ssc/experienceeditorcomponent/service/" + id + "/GetSublayoutHtml?uniqueId=" + renderingUniqueId + "&placeholder=" + self.placeholderKey(),
                    type: "GET"
                }).fail(function(error) {

                    if (persistedLayout) {
                        $sc("#scLayout").val(persistedLayout).change();
                    }

                    alert(error);
                }).done(function(response) {

                    _scl.PageModes.ChromeManager.select(null);

                    var responseHtml = jQuery(response);
                    var sublayout = responseHtml.select("#r_" + id);

                    var renderingData = { html: sublayout };
                    self.insertRendering(renderingData, openProperties);
                });
            } else {
                _scl.PageModes.Utility.tryAddStyleSheets(data.styleSheets);
                _scl.PageModes.Utility.tryAddScripts(data.scripts);
                _scl.PageModes.ChromeManager.select(null);
                this.insertRendering(data, openProperties);
            }
        };
      
        $sc.ajax(options);                  
    }

    function handleMessage(message, params) {
        switch (message) {
            
            case "chrome:placeholder:removeFxmPlaceholder":
                this.removePlaceholder();
                return;
        }

        this._handleMessage(message, params);
    }


    // reassign prototypes
    _scl.PageModes.ChromeTypes.Placeholder.prototype._handleMessage = _scl.PageModes.ChromeTypes.Placeholder.prototype.handleMessage;
    _scl.PageModes.ChromeTypes.Placeholder.prototype.handleMessage = handleMessage;

    _scl.PageModes.ChromeTypes.Placeholder.prototype.removePlaceholder = removePlaceholder;
    _scl.PageModes.ChromeTypes.Placeholder.prototype.addControlResponse = addControlResponse;
});