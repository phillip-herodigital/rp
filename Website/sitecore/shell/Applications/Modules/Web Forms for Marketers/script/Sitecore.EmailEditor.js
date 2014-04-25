
Sitecore.EmailEditor = new function () {

    Sitecore.Dhtml.attachEvent(window, "onload", function () { Sitecore.EmailEditor.load() });

    this.__RAD = null;
    this.__Field = null;
    this.dictionary = [];


    /* onload */
    this.load = function (sender, evt) {

        if (window.top.Sitecore == null) {
            window.top.Sitecore = Sitecore;
        }

        window.top.Sitecore.EmailEditor = Sitecore.EmailEditor;

        var Editor = $("Editor");

        if (Editor != null) {
            refreshEditor(Editor.contentWindow);

            this.__RAD = Editor.contentWindow;
            this.__Field = $("__Field");

            var doc = Editor.contentDocument == null ?
                   Editor.contentWindow.document :
                   Editor.contentDocument;

            this.createFieldMenu(doc.getElementsByTagName("a"));

            this.__RAD.RadEditorCommandList["Insert Field"] = this.insertField;
            this.createPopupMenu();

        }
    }

    function refreshEditor(editor) {
        if ($(editor).document.lastChild != null) {
            $(editor).document.lastChild.lastChild.style.height = "";
        }
    }

    this.hidePopupMenu = function () {
        var element = document.getElementById("InsertFieldDiv");
        element.style.visibility = "hidden";
    }

    this.createFieldMenu = function (dropDowns, values) {
        $A(dropDowns).each(function (element) {
            if (element.className == "reDropdown") {
                var spanElements = element.getElementsByTagName("span");
                if (spanElements != null && spanElements.length > 0 && spanElements[0].className == "Insert Field") {
                    element.id = "Insert Field";
                    var translation = Sitecore.EmailEditor.dictionary['Insert Field'];
                    element.title = translation;
                    var html = spanElements[0].innerHTML.toString().replace(/Insert Field/g, translation);
                    spanElements[0].innerHTML = html;
                }
                Sitecore.Dhtml.attachEvent(element, "onclick", ShowPopup);

            }
        });
    }


    this.insertField = function (element) {
       if (element != null) {
            var editor = Sitecore.EmailEditor.__RAD.scGetEditor();
            editor.set_html(Sitecore.EmailEditor.__RAD.scGetValue() + "[<label id='" + element.id + "'>" +
                           element.innerHTML + "</label>]");
            Sitecore.EmailEditor.hidePopupMenu();
        }
    }

    this.createPopupMenu = function () {

        var form = document.forms[0];

        if (form != null) {

            var div = document.createElement("div");
            div.className = "reDropDownBody";
            div.setAttribute("id", "InsertFieldDiv");
            div.style.visibility = "hidden";
            div.style.position = "absolute";
            div.style.height = "255px";
            div.style.width = "205px";
            div.style.left = "12px";
            div.style.top = IsFF() ? "162px" : "175px";
            div.style.zIndex = "100000";
            div.style.borderStyle = "Solid";
            div.style.borderWidth = "1px";
            div.style.borderColor = "#828282";
            div.style.background = "white";
            div.setAttribute("unselectable", "on");
            div.style.overflow = "auto";

            var table = document.createElement("table");
            table.setAttribute("cellpadding", "0");
            table.setAttribute("border", "0");
            table.setAttribute("unselectable", "on");
            table.style.cursor = "default";
            table.style.width = "100%";
            table.style.height = "100%";
            var i = 0;
            var fields = $("__Field").value.split('&');
            fields.each(function (field) {
                var pair = field.split('=');
                if (pair[1] != null) {
                    var tr = table.insertRow(i);
                    var td = tr.insertCell(0);
                    td.style.width = "100%";
                    td.style.fontSize = "13px";
                    td.style.fontFamily = "arial";
                    Sitecore.Dhtml.attachEvent(td, "onclick", function () { return Sitecore.EmailEditor.insertField(td); });
                    Sitecore.Dhtml.attachEvent(td, "onmouseover", function () { td.style.background = '#DFDFDF'; });
                    Sitecore.Dhtml.attachEvent(td, "onmouseout", function () { td.style.background = 'white'; });

                    td.setAttribute("id", pair[0]);
                    td.innerHTML = pair[1];
                    i++;
                }
            })

            div.appendChild(table);
            form.appendChild(div);
        }
    }

};

function ShowPopup(event) {
    var div = document.getElementById("InsertFieldDiv");
    if (div != null) {
        div.style.visibility = (div.style.visibility == "visible" ? "hidden" : "visible");
    }
    Event.stop(event);
}




