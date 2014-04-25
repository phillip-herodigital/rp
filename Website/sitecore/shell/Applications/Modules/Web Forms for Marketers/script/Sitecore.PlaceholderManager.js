
if (!Sitecore || Sitecore == 'undefined') {
    var Sitecore = new Object();
}

Sitecore.PlaceholderManager = new function() {

    Sitecore.Dhtml.attachEvent(window, "onload", function() { Sitecore.PlaceholderManager.load() });

    this.load = function(sender, event) {
        if ($('ActiveUrl') != null) {
            this.getPlaceholders($('ActiveUrl').value, Sitecore.PlaceholderManager.setContent, Sitecore.PlaceholderManager.setContent)
        }
    }

    this.getPlaceholders = function(url, success, failure) {
        if (url != null && url != '') {
            new Ajax.Request(url, {
                method: 'get',
                asynchronous: false,
                onSuccess: function(transport) {
                    success(transport.responseText);
                },
                onFailure: function(transport) {
                    failure(null);
                }
            });
        }
        else {
            failure(null);
        }
    }

    this.setContent = function(list) {
        if (list == 'indefined' || list == null || list.length == 0) {
            $('__LIST').innerHTML = "<div class='scEmptyContentListText'>" + $('__NO_PLACEHOLDERS_MESSAGE').value + "</div>";
        }
        else {
            $('__LIST').innerHTML = list;
        }

        var value = $('__LISTACTIVE').value;
        if (value != null && value != '') {
            value = value.replace(/emptyValue/, '');

            if ($(value) != null) {
                $('__LISTACTIVE').value = value;
            }
            else {
                $('__LISTACTIVE').value = 'emptyValue' + value;
            }
        }
    }

    this.IsAllowed = function(uniqueid) {
        var parts = uniqueid.split('/');
        if (this.__ALLOWED.indexOf(parts[parts.length - 1]) > -1) {
            return true;
        }
        return false;
    }

    this.highlightPlaceholder = function(element, evt, id) {
        var placeholder = $(id);

        if (placeholder != null) {
            if (evt.type == "mouseover") {
                placeholder.show();
            }
            else {
                placeholder.hide();
            }
        }

        this.showTooltip(element, evt);
    }

    this.onPlaceholderClick = function(element, evt, placeholder) {

        var e = $("ph_" + placeholder.replace(/[^a-zA-Z_0-9]/gi, "_"));

        var selectedPlaceholder = e.id.substr(3);
        var selectedPlaceholderKey = placeholder;

        $A($(e).up().childElements()).each(function(e) {
            e.className = "scPalettePlaceholder";
        });

        e.className = "scPalettePlaceholderSelected";

        $('__LISTACTIVE').value = e.id;
        $('__LISTVALUE').value = placeholder;

        Event.stop(evt);
    }


    this.showTooltip = function(element, evt) {
        var tooltip = $(element.lastChild);
        var x = Event.pointerX(evt);
        var y = Event.pointerY(evt);

        if (evt.type == "mouseover") {
            if (tooltip.style.display == "none") {
                clearTimeout(this.tooltipTimer);

                this.tooltipTimer = setTimeout(function() {
                    var html = tooltip.innerHTML;

                    if (html == "") {
                        return;
                    }

                    var t = $("scCurrentTooltip");
                    if (t == null) {
                        t = new Element("div", { "id": "scCurrentTooltip", "class": "scPalettePlaceholderTooltip", "style": "display:none" });
                        document.body.appendChild(t);
                    }

                    t.innerHTML = html;

                    t.style.left = x + "px";
                    t.style.top = y + "px";
                    t.style.display = "";
                }, 450);
            }
        }
        else {
            clearTimeout(this.tooltipTimer);
            var t = $("scCurrentTooltip");
            if (t != null) {
                t.style.display = "none";
            }
        }
    }

}
