
function alignButtons(buttons) {

    var list = $A(buttons);
    var maxWidth=0;
    list.each(function(item) {
        if (item != null) {
            item.style.width = '75px';
        }
    });

    list.each(function(item) {
        if (item != null) {
            var width = item.offsetWidth;
            maxWidth = maxWidth < width ? width : maxWidth;
        }
    });

    list.each(function(item) {
        if (item != null) {
            item.style.width = 'auto';
            var width = item.offsetWidth;
            maxWidth = maxWidth < width ? width : maxWidth;
        }
    });

    if (maxWidth <= 75) {
        list.each(function(item) {
            if (item != null) {
                item.style.width = maxWidth + 'px';
            }
        });
    }
}

function IsFF() {

    var agt = navigator.userAgent.toLowerCase();
    return (agt.indexOf("firefox") != -1);
}

function IsChrome() {

    var agt = navigator.userAgent.toLowerCase();
    return (agt.indexOf("chrome") != -1);
}


function patchStyle(e) {
    var element = $(e);

    element.up().style.width = "75px";
    element.up().style.height = "25px";

    element.style.width = "75px";

    element.down().align = "absmiddle";
    element.down().next().style.verticalAlign = "";
}
function IsIE() {

    var agt = navigator.userAgent.toLowerCase();
    return ((agt.indexOf("msie") != -1) && (agt.indexOf("opera") == -1));
}

function IsCursorInElement(element, cursorX, cursorY) {
    var parent = element.parentElement;
    var offset = 0;

    while (parent != null) {
        offset += parent.offsetTop;
        parent = parent.parentElement
    }

    return (element.clientTop + offset < cursorY && (element.clientTop + offset + element.clientHeight) > cursorY &&
           element.clientLeft < cursorX && (element.clientLeft + element.clientWidth) > cursorX);
}

function getOnlyValue(object) {
    for (attribute in object) {
        if (!(typeof object[attribute] == 'string')) {
            object[attribute] = "";
        }
    }

    return object;
}

function disableIsEmpty(sender, obj) {
    var source = $(sender);

    if (sender.getValue() == null || sender.getValue() == "") {
        $(obj).disabled = true;
    } else {
        $(obj).disabled = false;
    }
}

function clear(value, oldChar, newChar) {
    var _clear = "";
    for (var i = 0; i < value.length; ++i) {
        if (value.charAt(i) == oldChar) {
            _clear += newChar;
        } else {
            _clear += value.charAt(i);
        }
    }
    return _clear;
}

function OpenFormsEditorFromWebEdit(id) {
    var frame = $("scWebEditRibbon");
    var url = "http://" + location.hostname + "/default.aspx";
    var attribute = "?" + location.search + "&xmlcontrol=Forms.FormDesigner&formid=" + id;
    frame.src = url + attribute;
}

function zoom(ctr, width, height) {
    var x = (document.body.scrollWidth - 40) / ctr.clientWidth;
    //var y = (document.body.scrollHeight - 310) / ctr.clientHeight;

    ctr.style.zoom = x + "";

    $(ctr).select('input').each(function(element) {
        element.disabled = true;
    })
}


function unescapeArray(value, separator) {
    var array = value.split(separator);
    array.each(function(element) {
        element = unescape(element);
    })

    return array.join(separator);
}

function escapeArray(value, separator) {
    var array = value.split(separator);
    array.each(function(element) {
        element = escape(element);
    })

    return array.join(separator);
}

function onExpand(ctrl, target) {
    if (target.style.display == "none") {
        $(target).show();
        ctrl.firstChild.src = "/sitecore/shell/Applications/Modules/Web Forms for Marketers/images/up.png";
    } else {
        $(target).hide();
        ctrl.firstChild.src = "/sitecore/shell/Applications/Modules/Web Forms for Marketers/images/down.png";
    }
}

function select(obj, id) {
    if (event.srcElement != null && event.srcElement.tagName == "A") {
        var ctr = $(id);
        if (ctr.checked) {
            ctr.checked = false;
        } else {
            ctr.checked = true;
        }
        event.cancelBubble = true;
    }
    return true;
}

var __nonMSDOMBrowser = (window.navigator.appName.toLowerCase().indexOf('explorer') == -1);

function FireDefaultButton(event, target) {
    if (event.keyCode == 13 && !(event.srcElement && (event.srcElement.tagName.toLowerCase() == "textarea"))) {
        var defaultButton;
        if (__nonMSDOMBrowser) {
            defaultButton = document.getElementById(target);
        }
        else {
            defaultButton = document.all[target];
        }
        if (defaultButton && typeof (defaultButton.click) != "undefined") {
            defaultButton.click();
            event.cancelBubble = true;
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            return false;
        }
    }
    return true;
}

function updateVisibility(id, hidden) {
    if (hidden) {
        $(id).style.visibility = "hidden";
    } else {
        $(id).style.visibility = "visible";
    }
}

function updateDisplay(selectControl, id) {
    if (selectControl.selectedIndex == 0) {
        $(id).style.display = "none";
    } else {
        $(id).style.display = "block";
    }
}

function updateDisabled(checkboxControl, area, forbid) {
    if (forbid == null || !forbid) {
        $(area).disabled = !(checkboxControl.checked);

        $$('#' + area + ' input').each(function(element) {
            element.disabled = $(area).disabled;
        });
    }
}

function updateChecked(checkboxControl, value) {
    if (!value) {
        checkboxControl.checked = value;
    }
}