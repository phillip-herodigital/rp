 /* Sitecore.FormBuilder */

Sitecore.FormBuilder = new function () {

    this.uniqueID = 0;
    this.active = null;
    this.type = null;
    this.hover = null;
    this.activeFilter = "progid:DXImageTransform.Microsoft.Gradient(GradientType=1, StartColorStr='#DFE6EC', EndColorStr='#ffffff');";
    this.activeColor = "#f0f3f7";
    this.activeBorder = "1px solid #B1B5BA";

    this.fieldEmpty = ''; //$('AddNewFieldText').value;
    this.sectionEmpty = ''; //$('AddNewSectionText').value;
    this.scopes = null;
    this.workPanel = null;
    this.initialized = false;
    this.form = null;

    this.dictionary = [];

    Sitecore.Dhtml.attachEvent(window, "onload", function () { Sitecore.FormBuilder.load() });

    $j(document).ready(function () {
        $j(window).resize(function () {
            Sitecore.FormBuilder.updateSize();
        });

        $j(".v-splitter").bind('change', function () {
            Sitecore.FormBuilder.updateSize();
        });

        $j(window).trigger('resize');
    })

    if (window.document.readyState != null) {
        setTimeout("Sitecore.FormBuilder._tryToWindowOnLoadedInIE()", 1000);
    }

    this.updateSize = function () {
        var panel = $j("#PropertiesPanel");
        if (!((navigator.userAgent.toLowerCase().indexOf("msie") != -1) && (navigator.userAgent.toLowerCase().indexOf("opera") == -1))) {
            //panel.height($j('form').height() - $j("#RibbonPanel").outerHeight());
           // $j("#WorkPanel").height($j('form').height() - $j("#RibbonPanel").outerHeight() - 40);
        }
        
        if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
            $j("#WorkPanel").css({position: 'absolute', 
            top: '66px', 
            bottom: '0'});
        }

        $j("#PropertiesPanel .sc-accordion-header").width(panel[0].clientWidth)
        $j("#PropertiesPanel .sc-accordion-header-center").width(panel[0].clientWidth - 5);
    }

    this._tryToWindowOnLoadedInIE = function () {
        if (!this.initialized) {
            if (window.document.readyState != null) {
                if ((window.document.readyState == 'complete' || window.document.readyState == 'interactive')) {
                    if (!this.initialized) {
                        this.initialized = true;
                        Sitecore.FormBuilder.load(window, null, true);
                    }
                }
                else {
                    setTimeout("Sitecore.FormBuilder._tryToWindowOnLoadedInIE()", 1000);
                }
            }
        }
    }

    /* onload */
    this.load = function (sender, evt, stillExec) {

        this.loadModel();

        if (!this.initialized || stillExec == true) {
            this.scopes = $$("#ContentTitle", "#ContentIntro", "#ContentFooter", "#SubmitTab", "#PropertySettings");

            this.workPanel = $('WorkPanel');

            this.updateStructure(true);

            var caption = $("FormTitle").innerHTML;

            if (caption != null) {
                if (window.parent.scWin != null) {
                    window.parent.scWin.setCaption(caption);
                }
            }

            var frame = Sitecore.Dhtml.getFrameElement(window);

            if (window.top.Sitecore == null) {
                window.top.Sitecore = Sitecore;
            }

            window.top.Sitecore.FormBuilder = Sitecore.FormBuilder;


            if ($("Welcome") != null) {
                this.selectControl(this, event, 'Welcome', 'PropertySettings', true);
            } else {
                this._selectPredefined();
            }

            this._setButtonState($("TitleButton"), $("ShowTitle"), $("TitleBorder"));
            this._setButtonState($("IntroButton"), $("ShowIntro"), $("Intro"));
            this._setButtonState($("FooterButton"), $("ShowFooter"), $("Footer"));
        }
        this.initialized = true;
        scForm.setModified(false);
    }

    this.hideEditors = function () {
        $('PropertySettings').style.display = "none";
        if (this.scopes != null) {
            this.scopes.each(
                function (element) {
                    element.style.display = "none";
                });
        }
    }

    this.queryState = function (scope) {
        var element = $(scope);

        if (element.style.display == "none") {
            return false;
        } else {
            return true;
        }
    }

    this.updateStructure = function (isRefreshSortable) {

        var structure = "";

        Position.includeScrollOffsets = true;

        var sections = $$('#FormBuilder div.scFbTableSectionScope');

        var contains = '';
        var ispresentone = false;
        if (sections[0] != null && !this._isAllSectionsDeleted()) {

            if (isRefreshSortable) {
                sections.each(
                    function (element) {
                        contains += ' ' + element.id + "Section";
                    });
            }

            var sectionids = $w(contains);

            sections.each(
                function (element) {

                    if (isRefreshSortable) {
                        Sortable.create(element.id + "Section",
                                    { tag: 'div',
                                        only: 'scFbTableFieldScope',
                                        dropOnEmpty: true,
                                        containment: sectionids,
                                        scroll: 'WorkPanel',
                                        overlap: 'vertical',
                                        constraint: 'vertical',
                                        scrollSensitivity: 5,
                                        scrollSpeed: 10,
                                        zindex: 100001,
                                        format: /^(.*)(?:[A-Za-z0-9\-\_]*)$/,
                                        onUpdate: Sitecore.FormBuilder.onUpdateSorting
                                    });
                    }
                });

            if (isRefreshSortable) {
                Sortable.create('FormBuilder',
                            { tag: 'div',
                                only: 'scFbTableSectionScope',
                                dropOnEmpty: true,
                                containment: ["FormBuilder"],
                                scroll: 'WorkPanel',
                                overlap: 'vertical',
                                constraint: 'vertical',
                                scrollSensitivity: 10,
                                scrollSpeed: 30,
                                format: /^(.*)(?:[A-Za-z0-9\-\_]*)$/,
                                handle: 'scFbTableSectionHeader',
                                onUpdate: Sitecore.FormBuilder.onUpdateSorting
                            });
            }

        } else {
            var fields = $$('#FormBuilder div.scFbTableFieldScope');

            if (fields.size() > 0) {
                if (isRefreshSortable) {
                    Sortable.create('FormBuilder_empty',
                        { tag: 'div',
                            only: 'scFbTableFieldScope',
                            dropOnEmpty: true,
                            containment: ["FormBuilder_empty"],
                            scroll: 'WorkPanel',
                            overlap: 'vertical',
                            constraint: 'vertical',
                            scrollSensitivity: 10,
                            scrollSpeed: 30,
                            format: /^(.*)(?:[A-Za-z0-9\-\_]*)$/,
                            onUpdate: Sitecore.FormBuilder.onUpdateSorting
                        });
                }
            }
        }

        this.processStructure();
    }

    this.processStructure = function () {

        //var sections = $$('#FormBuilder div.scFbTableSectionScope, ');
        var structure = "",
            self = this;
        $j("#FormBuilder div.scFbTableSectionScope, #FormBuilder div.scFbTableFieldScope").each(function () {
            structure += "," + this.id;
        });

        $('Structure').value = structure;
        //this.save();
    }

    this.save = function () {
        $j('#form').val(JSON.stringify(this.form));
    }

    this.loadModel = function () {
        this.form = $j.parseJSON($j('#form').val());
    }

    this.setField = function (field, properties) {
        this.form.fields.push($j.extend(properties, { id: fieldid }));
    }

    this.getField = function (field) {
        var result = null
        $j(this.form.fields).each(function () {
            if (this.id != null && this.id == field || this.id.v == field) {
                result = this;
                return false;
            }
        })
        return result;
    }

    this.getStructure = function (array, addroot) {
        var structure = "";
        array.each(function (element) {
            if (addroot) {
                structure += (structure != "" ? "," : "") + element.id;
            }
            var fields = $$('#' + element.id + ' div.scFbTableFieldScope');
            fields.each(
                     function (field) {
                         structure += (structure != "" ? "," : "") + field.id;
                     });
        });
        return structure;
    }

    this.onChangeSorting = function (element) {
    }

    this.onUpdateSorting = function (element, moved, i1, i2, i3) {
        Sitecore.FormBuilder.updateStructure(false);
        scForm.setModified(true);
        if ($j(moved).hasClass("scFbTableFieldScope") || $j(moved).hasClass("scFbTableSectionScope")) {
            Sitecore.FormBuilder.selectControl(moved, event, moved.id, 'PropertySettings', true);
        }
    }

    this.addField = function (sender, event, idDestination, effect) {
        var destination = $j(idDestination);

        var idField = this.getUniqueID();
        var pos = !destination.hasClass('scFbTableSectionScope') ? (destination.children().length - 1) : $(idDestination + "Section").childNodes.length;

        scForm.postEvent(this, event, 'AddNewField("' + idDestination + '","' + idField + '","' + pos + '")');

        this.updateStructure(true);

        this.selectControl($(idField), event, idField, 'PropertySettings', true);

        $(idField + "_field_name").activate();
    }

    this.moveValue = function (source, destination, fieldName, iFrameName) {

        var target = $(destination);
        if (target != null) {
            if (target.tagName == "INPUT") {

                target.value = $(source).value;
                if (target.value == "") {
                    target.value = "Submit";
                } else {
                }

            } else {
                target.innerHTML = $(source).value;
            }
        }
        else {
            var frame = $(iFrameName);

            var query = frame.contentWindow.location.search;
            if (query.indexOf(destination) > -1) {
                var params = $A(query.split("&"));
                var field = false;
                var id = "";

                params.each(function (param) {
                    var pair = param.split("=");

                    if (pair[0] == "fieldname") {
                        field = true;
                    }

                    if (pair[0] == "contentid") {
                        id = pair[1];
                    }
                    if (field && id != "") {
                        var ctl = frame.contentWindow.window.document.getElementById(id + "_content")
                        if (ctl != null) {

                            ctl.innerHTML = $(source).value;

                            findFrame = true;

                            OverflowController.getInstance().Init(iFrameName);

                            throw $break;
                        }
                    };
                })
            };
        }
    }

    this.validateValue = function (source, destination, fieldName, iFrameName) {
        this.moveValue(source, destination, fieldName, iFrameName);

        scForm.postEvent(this, event, 'forms:validatetext(ctrl=' + source + ')');

        var validator = $(source + "Validate");

        if (validator != null) {
            if (validator.className == "scFbNotValide") {
                $(source + "Fix").style.display = "inline";
            } else {
                $(source + "Fix").style.display = "none";
            }
        }
    }

    this.setRichText = function (id, text) {
        var element = $(id);
        element.value = text;
        this.executeKeyUp(element);
    }

    this.executeKeyUp = function (element) {

        if (element.onkeyup != null) {
            var command = element.onkeyup.toString();
            command = command.substring(command.indexOf("{") + 1, command.indexOf("}"));
            ("<script>" + command + "</script>").evalScripts();
        }
    }

    this.executeOnClick = function (element) {
        if (element.onclick != null) {
            var command = element.onclick.toString();
            if (command.indexOf("return") > -1) {
                command = command.substring(command.indexOf("return") + 6, command.indexOf("}"));
            }

            ("<script>" + command + "</script>").evalScripts();

        }
    }

    this.executeOnChange = function (element) {

        if (element.onchange != null) {
            var command = element.onchange.toString();
            command = command.substring(command.indexOf("{") + 1, command.indexOf("}"));
            ("<script>" + command + "</script>").evalScripts();
        }
    }

    this.addSection = function (sender, event, currentSectionId, effect) {
        var destination = $("FormBuilder");

        var idSection = this.getUniqueID();

        var current = $(currentSectionId);

        scForm.postEvent(this, event, 'AddNewSection("' + idSection + '","' + $A(current.parentNode.childNodes).indexOf(current) + '")');

        this.updateStructure(true);

        this.selectControl($(idSection), event, idSection, 'PropertySettings', true);

        $(idSection + "_section_name").activate();
    }

    this.upgradeToSection = function (sender, event, effect) {

        if (this.active != null) {
            this.clearSelect(this.active);
        }

        var formBuilder = $("FormBuilder");

        var idSection = this.getUniqueID();

        scForm.postEvent(this, event, 'UpgradeToSection("' + "FormBuilder" + '","' + idSection + '")');

        this.updateStructure(true);
        this.selectControl($(idSection), event, idSection, 'PropertySettings', true);

        $$('#FormBuilder input.scFbTableSectionName').last().activate();

        //$(idSection + "_section_name").activate();
    }

    this._isAllSectionsDeleted = function () {
        var isAllDeleted = true;
        $$('#FormBuilder' + " div.scFbTableSectionScope").each(
            function (element) {
                if ($F(element.id + "_section_deleted") != "1") {
                    isAllDeleted = false;
                }
            });
        return isAllDeleted;
    }

    this.isAllFieldsDeleted = function (sectionId) {
        var isAllDeleted = true;
        $$('#' + sectionId + " div.scFbTableFieldScope").each(
            function (element) {
                if ($F(element.id + "_field_deleted") != "1") {
                    isAllDeleted = false;
                }
            });
        return isAllDeleted;
    }

    this.showWarningEmptyForm = function () {

        scForm.postEvent(this, event, 'WarningEmptyForm');

        new Effect.Appear("FormBuilder", { duration: .3 });
    }

    this.showWarningEmptySection = function () {

    }

    this.deleteSection = function (sender, evt, id, effect) {

        $(id + "_section_deleted").value = "1";

        var fields = $$('#' + id + ' div.scFbTableFieldScope');

        fields.each(
            function (element) {
                $(element.id + "_field_deleted").value = "1";
            });

        $(id).style.display = "none";

        scForm.setModified(true);

        this.updateFormState(id);
    }

    this.updateFormState = function (id) {
        if (this._isAllSectionsDeleted() && this.isAllFieldsDeleted("FormBuilder")) {
            this.showWarningEmptyForm();
            this.executeOnClick($('Welcome'));
        } else {
            this.selectSomething(id);
        }
    }

    this.selectSomething = function (deleted) {
        if (this.active == deleted) {
            var element = $(deleted);
            if (element != null) {
                var deleteMarker;

                var pointer = element;
                if (element.previousSibling != null) {
                    do {
                        pointer = pointer.previousSibling;
                        deleteMarker = $(pointer.id + "_field_deleted") || $(pointer.id + "_section_deleted");
                    } while (pointer != null && pointer.previousSibling != null && (deleteMarker != null && deleteMarker.value == "1"));
                } else {
                    pointer = element.parentNode.parentNode;
                }

                if (pointer != null && pointer.style.display != "none" && pointer != element) {

                    if ($j(pointer).hasClass("scFbTableSectionScope")) {
                        pointer = $(pointer.id + "SectionRow");
                    }

                    if (pointer.onclick != null) {
                        this.executeOnClick(pointer);
                        return;
                    }
                }
            }
        }
        this._selectPredefined();
    }

    this._selectPredefined = function () {
        if (!this._selectVisibleElement($$("#TitleBorder", "#Intro", "#Welcome"))) {
            if (!this._selectVisibleElement($$('#FormBuilder div.scFbTableSectionScope'), "SectionRow")) {
                if (!this._selectVisibleElement($$('#FormBuilder div.scFbTableFieldScope'))) {
                    this._selectVisibleElement($$("#Footer", "#SubmitGrid"));
                }
            }
        }
    }

    this._selectVisibleElement = function (array, postfix) {
        var isfound = false;
        if (array.size() > 0) {
            try {
                array.each(
                function (element) {
                    if (element != null) {
                        if (element.style.display != "none") {
                            if (postfix != null && postfix != "") {
                                Sitecore.FormBuilder.executeOnClick($(element.id + postfix));
                            } else {
                                Sitecore.FormBuilder.executeOnClick(element);
                            }
                            isfound = true;
                            throw $break;
                        }
                    }
                })
            }
            catch (e) {
            }
        }
        return isfound;
    }

    this.deleteField = function (sender, evt, id, effect) {
        $(id + "_field_deleted").value = "1";
        $(id).style.display = "none";
        scForm.setModified(true);

        this.updateFormState(id);
    }

    this.mouseMove = function (sender, evt, id) {
        if (!(typeof scForm === null)) {

            if (id != this.active) {
                if (typeof (id) == "object") {
                    id = scForm.browser.getFrameElement(id).parentNode.id;
                }
                var element = $(id);

                if (element != null) {
                    if (this.hover != null && this.hover != element) {
                        this.mouseOver(this.hover, null, this.hover.id);
                    }

                    this.hover = element;
                    element.style.border = "1px dashed #555555";
                    this.displayButtons(id, "visible");
                }
            }
            scForm.browser.clearEvent(evt, true);
        }
    }

    this.mouseOver = function (sender, evt, id) {

        if (!(typeof scForm === null)) {

            if (typeof (id) == "object") {
                id = scForm.browser.getFrameElement(id).parentNode.id;
            }
            var element = $(id);

            if (element != null) {

                if (id == this.active) {
                    element.style.border = this.activeBorder;
                } else {
                    element.style.border = "1px solid";
                    element.style.borderColor = element.style.backgroundColor || "transparent";
                    this.displayButtons(id, "hidden");
                }
            }
        }
    }

    this.displayButtons = function (id, state) {

        var buttons = $(id + "ButtonContainer");
        if (buttons != null) {
            buttons.style.visibility = state;
        }
    }

    this.onClick = function (sender, evt, id, borderColor, backgroundColor) {
        var element = $(id);

        element.style.borderTop = "solid 1px " + (borderColor != null ? borderColor : this.activeColor);
        element.style.borderBottom = "solid 1px " + (borderColor != null ? borderColor : this.activeColor);

        element.style.backgroundColor = backgroundColor != null ? backgroundColor : this.activeColor;

        if (this.active != id) {
            this.setBackgroundColor($(this.active), "");
            this.active = id;
        }
    }


    this.focus = function (sender, evt, id, activeTab) {
        this.mouseOver(sender, evt, id)

        var oldActive = $(this.active);
        var newActive = $(id);

        if (oldActive == newActive) {
            return;
        }

        if (oldActive != null) {
            this.clearSelect(oldActive.id);
        }

        this.refreshActive(newActive, evt, activeTab);
    }

    this.refreshActive = function (newActive, evt, activeTab) {

        if (newActive != null) {

            this.active = newActive.id;
            var fieldType = $(this.active + "_field_type");
            if (fieldType != null) {
                this.type = fieldType.selectedIndex;
            }

            this.select(this.active);

            $("Active").value = this.active;
        }
        else {
            this.active = null;
        }

        this.onSelectedChange(newActive, evt);
        this.updateAccordion();
    }

    this.select = function (id) {

        var element = $(id);

        if (element != null) {
            element.style.backgroundColor = this.activeColor;
            element.style.border = this.activeBorder;
            $j(element).addClass('sc-section-selected');

            this.updateInnerFields(element, this.activeColor);

            var marker = $(id + "Marker");

            if (marker != null) {
                $(id + "Marker").style.visibility = "visible";
            }

            this.displayButtons(id, "visible");
        }
    }

    this.updateInnerFields = function (current, color) {
        if ($j(current).hasClass("scFbTableSectionScope")) {

            var field = $$('#' + current.id + ' div.scFbTableFieldScope');

            field.each(function (element) {
                element.style.border = "1px solid";
                element.style.borderColor = color;
                element.style.backgroundColor = color;
            });
        }
    }

    this.clearSelect = function (id) {
        var element = $(id);

        if (element != null) {
            element.style.border = "1px solid transparent";
            element.style.backgroundColor = "transparent";

            $j(element).removeClass('sc-section-selected');


            var marker = $(id + "Marker");
            if (marker != null) {
                $(id + "Marker").style.visibility = "hidden";
            }
            this.updateInnerFields(element, "transparent");

            this.displayButtons(id, "hidden");
        }
    }

    this.setBackgroundColor = function (element, color) {
        if (element != null) {
            if ($j(element).hasClass("scFbTableSectionScope")) {
                $(element.id + "SectionRow").style.background = color;


                var field = $$('#' + element.id + ' div.scFbTableFieldScope');
                field.each(function (element) {
                    element.style.border = "1px solid";
                    element.style.borderColor = color;
                    element.style.backgroundColor = "transparent";
                })

            } else {
                element.style.background = color;
            }
        }
    }

    this._scrollToElement = function (element) {

        if (element.style.display != "none") {
            element.focus();
            if ($j(element).hasClass("scFbTableSectionScope")) {
                $(element.id + "_section_name").focus();
            } else if ($j(element).hasClass("scFbTableFieldScope")) {
                $(element.id + "_field_name").focus();
            }
        } else {
            this._selectPredefined();
        }
    }

    this.selectControl = function (sender, evt, id, tab, focus, focusedid, silent) {

        if (this.active != id) {

            if (typeof (id) == "object") {
                id = scForm.browser.getFrameElement(id).parentNode.id;
                focusedid = id + focusedid;
                tab = tab + id;
            }

            this.hideEditors();

            if (tab != null) {
                if (tab == "SubmitTab") {
                    if (Sitecore.PropertiesBuilder.UpdateTag) {
                        Sitecore.PropertiesBuilder.UpdateTag = null;
                        scForm.postEvent(this, evt, 'UpdateSubmit()');
                    }
                }
                $j("#" + tab).show();
            }


            if (focus) {
                this.focus(sender, evt, id, tab);
            }

            if (tab != null) {
                $j("#" + tab).show();
            }

            this._scrollToElement($(id));

            if (focusedid != null && focusedid != '' && sender != null && sender.id != focusedid) {
                var focuselem = $(focusedid);
                focuselem.select();
            }
        }

        $j(window).trigger('resize');

        return true;
    }

    this.getIndexOfEditor = function (id) {
        var i = 0;

        this.scopes.each(function (element, index) {
            if (element.id == id) {
                i = index;
            }
        })

        return i;
    }

    this.focusInput = function (sender, evt, id, tab, focus) {
        var ctrl = $(id + "_field_name") || $(id + "_section_name");
        if (ctrl != null && ctrl.tagName == 'INPUT') {
            if ((ctrl.className == "scFbTableFieldNameInput" && (ctrl.value == $('AddNewFieldText').value || ctrl.value == ctrl.title)) ||
                (ctrl.className == "scFbTableSectionName" && (ctrl.value == $('AddNewSectionText').value || ctrl.value == ctrl.title))) {

                ctrl.value = "";
                ctrl.style.color = "";
            }
        }

        Sitecore.FormBuilder.selectControl(sender, evt, id, tab, focus);
    }

    this.blurInput = function (sender, evt, id) {
        var ctrl = $(id + "_field_name") || $(id + "_section_name");
        if (ctrl != null && ctrl.tagName == 'INPUT' && ctrl.value == '') {
            if (ctrl.className == "scFbTableFieldNameInput") {
                ctrl.value = ctrl.title || $('AddNewFieldText').value;
                ctrl.style.color = "silver";
            } else if (ctrl.className == "scFbTableSectionName") {
                ctrl.value = ctrl.title || $('AddNewSectionText').value;
                ctrl.style.color = "silver";
            }
        }
    }

    this.onChangeType = function (sender, evt) {
        this.onChangeFieldType(sender, this.type, evt);
        this.updateAccordion();
    }

    this.updateAccordion = function () {
        $j("#Properties").collapsible('destroy').collapsible();
        $j("#Properties").bind('collapsiblechange', function () {
            Sitecore.FormBuilder.updateSize();
        })
    }

    this.setModified = function () {
        Sitecore.UI.ModifiedTracking.setModified(true);
    }

    this.fieldChange = function (sender, evt) {
        Sitecore.UI.ModifiedTracking.handleEvent(evt, false);
    }

    this.showLayout = function (edit, editorScope, designerScope, button, showCheck, state, defaultText) {

        if (state) {
            showCheck.value = "";

            designerScope.style.display = "none";

            this.executeKeyUp(edit);
            this._selectPredefined();

            button.className = "scRibbonToolbarLargeButton";

            $j(editorScope).hide();
        } else {
            showCheck.value = "1";
            edit.value = edit.value == "" ? defaultText : edit.value;

            designerScope.style.display = "block";

            this.executeKeyUp(edit);
            this.executeOnClick(designerScope);

            button.className = "scRibbonToolbarLargeButtonDown";
        }
    }

    this.layoutsHide = function () {
        var scopes = $$('#ContentTitle', '#ContentIntro', '#ContentFooter');
        var res = true;

        scopes.each(
            function (element) {
                var i = 0;
                ++i;
                res = (res && (element.style.display == "none"));
            })

        return res;
    }

    this._setButtonState = function (button, state, designElement) {

        if (designElement.style.display != "none") {
            button.className = "scRibbonToolbarLargeButtonDown";
            state.value = "1";
        } else {
            button.className = "scRibbonToolbarLargeButton";
            state.value = "0";
        }
    }

    this.updateTitle = function () {
        this.showLayout($("TitleEdit"), $("ContentTitle"),
                        $("TitleBorder"), $("TitleButton"), $("ShowTitle"),
                        $("TitleBorder").style.display != "none", "Untitled Form");
    }

    this.updateIntro = function () {
        this.showLayout($("IntroHtml"), $("ContentIntro"),
                        $("Intro"), $("IntroButton"), $("ShowIntro"),
                        $("Intro").style.display != "none", "Set text for the introduction of the form");
    }

    this.updateFooter = function () {
        this.showLayout($("FooterHtml"), $("ContentFooter"),
                        $("Footer"), $("FooterButton"), $("ShowFooter"),
                        $("Footer").style.display != "none", "Set text for the footer of the form");
    }

    this.rise = function (message, id) {
        scForm.postEvent(this, event, message + '(target=' + id + ',value=' + escape($(id).value) + ')');
    }

    this.globalRise = function (message, id) {
        scForm.invoke(message + '(target=' + id + ',value=' + escape($(id).value) + ')');
    }

    this.getUniqueID = function () {

        this.uniqueID++;
        return "i" + this.uniqueID;
    }

    this.SaveData = function () {
        var active = $(this.active);
        var pos = -1;
        if ($j(active).hasClass("scFbTableSectionScope")) {
            pos = this._getElementPositionByID(active.id, $$('FormBuilder .scFbTableSectionScope'));
        } else if ($j(active).hasClass("scFbTableFieldScope")) {
            pos = this._getElementPositionByID(active.id, $$('FormBuilder .scFbTableFieldScope'));
        }

        this.clearSelect(this.active)

        Sitecore.App.invoke("forms:save");
        this.updateStructure(true);
        this.active = null;
        this.updateFormState(active);

        if ($j(active).hasClass("scFbTableSectionScope")) {
            active = $(this._getElementByPosition(pos, $$('FormBuilder .scFbTableSectionScope')) + "SectionRow");
        } else if ($j(active).hasClass("scFbTableFieldScope")) {
            active = $(this._getElementByPosition(pos, $$('FormBuilder .scFbTableFieldScope')));
        }

        if (active != null && active.style.display != "none" && active.onclick != null) {
            Sitecore.FormBuilder.executeOnClick(active);
        } else {
            this._selectPredefined();
        }

    }

    this._getElementPositionByID = function (id, array) {

        var pos = 0;

        array.each(function (element) {
            if (element.display != "none") {
                if (element.id != id) {
                    ++pos;
                } else {
                    throw $break;
                }
            }
        });

        return pos;
    }

    this._getElementByPosition = function (index, array) {

        var id = "";
        var pos = 0;

        array.each(function (element) {
            if (element.display != "none") {
                if (pos != index) {
                    ++pos;
                } else {
                    id = element.id;
                    throw $break;
                }
            }
        })

        return id;
    }

    /* sorting */

    this.getPosition = function (parentNode, node) {
        var pos = IsIE() ? -1 : 0;
        for (var i in parentNode.childNodes) {
            if (parentNode.childNodes[i].id == node.id) {
                return pos;
            }
            ++pos;
        }
        return -1;
    }

    this.FuncForFieldOrSection = function (obj, delegate) {
        if (obj != null) {
            if ($j(obj).hasClass("scFbTableSectionScope") || $j(obj).hasClass("scFbTableFieldScope")) {
                if (obj.parentNode != null) {
                    if (delegate()) {
                        this.select(obj.id);
                    }
                }
            }
        }
    }

    this.moveUp = function () {
        var ctrl = $(this.active);

        this.FuncForFieldOrSection(ctrl, function () {
            var parentNode = ctrl.parentNode;
            var pos = Sitecore.FormBuilder.getPosition(parentNode, ctrl);
            if (pos > 0) {
                parentNode.removeChild(ctrl);
                parentNode.insertBefore(ctrl, parentNode.childNodes[pos - 1]);
                Sitecore.FormBuilder.updateStructure(false);
                return true;
            }
        })

        return false;
    }

    this.moveDown = function () {
        var ctrl = $(this.active);

        this.FuncForFieldOrSection(ctrl, function () {
            var parentNode = ctrl.parentNode;
            var pos = Sitecore.FormBuilder.getPosition(parentNode, ctrl);
            if (pos < parentNode.childNodes.length - 1) {
                parentNode.removeChild(ctrl);
                if (pos == parentNode.childNodes.length - 1) {
                    parentNode.appendChild(ctrl);
                } else {
                    parentNode.insertBefore(ctrl, parentNode.childNodes[pos + 1]);
                }
                Sitecore.FormBuilder.updateStructure(false);
                return true;
            }
        })
        return false;
    }

    this.moveFirst = function () {
        var ctrl = $(this.active);

        this.FuncForFieldOrSection(ctrl, function () {
            var parentNode = ctrl.parentNode;

            if (parentNode.childNodes.length > 1) {
                parentNode.removeChild(ctrl);
                parentNode.insertBefore(ctrl, parentNode.childNodes[0]);
                Sitecore.FormBuilder.updateStructure(false);
                return true;
            }
        })
        return false;
    }

    this.moveLast = function () {
        var ctrl = $(this.active);

        this.FuncForFieldOrSection(ctrl, function () {
            var parentNode = ctrl.parentNode;
            var pos = Sitecore.FormBuilder.getPosition(parentNode, ctrl);
            if (parentNode.childNodes.length > 1) {
                parentNode.removeChild(ctrl);
                parentNode.appendChild(ctrl);
                Sitecore.FormBuilder.updateStructure(false);
                return true;
            }
        })
        return false;
    }

    /* events handler section*/
    this.onSelectedChange = function (sender, evt) {

    }

    this.onChangeFieldType = function (sender, oldValue, evt) {

    }
} 

function scGetFrameValue(value, request) {
    if (request.parameters == "forms:save" ||
        request.parameters == "item:save" ||
        request.parameters == "contenteditor:save" ||
        request.parameters == "contenteditor:saveandclose") {

        Sitecore.FormBuilder.SaveData();
    }
    return null;
}


(function ($) {

$.widget("sc.collapsible", {

    options: {
        header: '.sc-accordion-header-left'
    },

    _create: function () {
        var self = this,
	        options = self.options;


        self.headers = self.element.find(options.header + ":visible");
        if (self.headers.length > 1) {
			self.headers.bind("mouseenter.collapsible", function () { $(this).addClass("ui-state-hover"); })
			.bind("mouseleave.collapsible", function () { $(this).removeClass("ui-state-hover"); })
			.bind("focus.collapsible", function () { $(this).addClass("ui-state-focus"); })
			.bind("blur.collapsible", function () { $(this).removeClass("ui-state-focus"); })
            .click(function () {                
                var header = $(this);
                header.next().slideToggle('slow', function(){self.element.trigger('collapsiblechange')});
                
                return false;
            });
       }
    },

    _setOption: function (key, value) {
        $.Widget.prototype._setOption.apply(this, arguments);

        if (key == "toggle") {
            $(this.headers[value]).trigger('click');
        }
    },

    destroy: function () {
        this.headers.unbind();
        return $.Widget.prototype.destroy.call(this);
    }
});

})(jQuery);