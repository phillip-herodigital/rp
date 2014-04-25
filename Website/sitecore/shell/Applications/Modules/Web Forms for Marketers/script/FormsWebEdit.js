

FormsWebEdit = new function () {

}

FormsWebEdit.GetFormId = function () {
    var children = Sitecore.PageModes.ChromeManager._selectedChrome.element.childNodes;
    var formId = null;

    $A(children).each(function (element) {
        if (element.className == "scfForm") {
            formId = element.id.replace("form_", "");
        }
    });
    if (formId != null) {
        formId = "{" + formId.substr(0, 8) + "-" + formId.substr(8, 4) + "-" + formId.substr(12, 4) + "-" + formId.substr(16, 4) + "-" + formId.substr(20, 12) + "}";
    }
    return formId;
}

FormsWebEdit.OpenFormDesigner = function (id, uri) {
    var formId = id;
    if (formId == null) {
        formId = FormsWebEdit.GetFormId();
    }
    if (formId != null) {
        FormsWebEdit.OpenEditor(formId, uri);
    }
}


convertToGuid = function (shortId) {
    return
}

FormsWebEdit.BuildUrl = function (id, uri) {

    var url = location.href;

    if (location.search == "" && url.charAt(url.length - 1) != "?") {
        url += '?';
    }

    var ind = url.indexOf("&formid=");
    if (ind > -1) {
        url = url.substring(0, ind);
    }

    if (url.indexOf("sc_ce=0") > -1) {
        url = url.replace("sc_ce=0", "sc_ce=1");
    } else {
        if (url.indexOf("sc_ce=1") == -1) {
            url += "&sc_ce=1";
        }
    }

    url += "&formid=" + id;

    return url;
}

FormsWebEdit.OpenEditor = function (id, uri) {
    var url = FormsWebEdit.BuildUrl(id, uri);
    FormsWebEdit.CheckModified(url);
}


FormsWebEdit.CloseEditor = function (id) {
    var href = window.location.href;

    href = href.replace("sc_ce=1", "sc_ce=0");
    href = href.replace("&formid=" + id, "");
    window.top.Sitecore.WebEdit.setCookie("sitecore_webedit_editing", "");

    window.location.href = href;
}

FormsWebEdit.CheckModified = function (url) {

    var ribbon = document.getElementById("scWebEditRibbon");
    var event = window.event;
    try {
        if (event == null | event == "undefined") {
            event = Event.fire(new Element("div"), "click", "");
        }
    } catch (ex) {
        event = Event.fire(new Element("div"), "click", "");
    }

    if (ribbon != null) {
        if (Sitecore.WebEdit.modified) {
            ribbon.contentWindow.scForm.postEvent(this, event, 'javascript:scSave("' + 'forms:open' + escape('(mode=run,url=' + url.substring(0, url.indexOf('?')) + ',param=' + url.substring(url.indexOf('?') + 1, url.length) + ')') + '")');
        }
        else {
            ribbon.contentWindow.scForm.postEvent(this, event, 'javascript:scForm.postRequest("","","", "' + 'forms:open(mode=run,url=' + escape(url.substring(0, url.indexOf('?'))) + ',param=' + escape(url.substring(url.indexOf('?') + 1, url.length)) + ')' + '")');
        }
    }
}
