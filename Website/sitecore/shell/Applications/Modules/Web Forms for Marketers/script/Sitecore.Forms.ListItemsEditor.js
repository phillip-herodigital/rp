scForm.OnChangeField = function (sender, event, fieldName) {
    if (Sitecore.Forms.PopupMenu.args != null) {

        Sitecore.Forms.PopupMenu.args.value = fieldName;
        if (Sitecore.Forms.PopupMenu.args.id != 'ctl00_ctl05_ctl00_ctl00_ctl04_ItemTextField') {
            $('ValueFieldLiteral').innerHTML = "[" + fieldName + "]";
        } else {
            $('TextFieldLiteral').innerHTML = "[" + fieldName + "]";
        }
        Sitecore.Forms.PopupMenu.args = null;
    }

    ListItems.callback(
        "0&queriessessionkey=" + $('ctl00_ctl05_ctl00_ctl00_ctl04_QueryKeyHolder').value + "&querytype=" + $('ctl00_ctl05_ctl00_ctl00_ctl04_SetItemsMode').getValue() +
        '&ctl00_ctl05_ctl00_ctl00_ctl04_ItemValueField=' + $('ctl00_ctl05_ctl00_ctl00_ctl04_ItemValueField').value +
        '&ctl00_ctl05_ctl00_ctl00_ctl04_ItemTextField=' + $('ctl00_ctl05_ctl00_ctl00_ctl04_ItemTextField').value +
        '&XPathQueryEdit=' + $('XPathQueryEdit').value +
        '&SitecoreQueryEdit=' + $('SitecoreQueryEdit').value +
        '&FastQueryEdit=' + $('FastQueryEdit').value
    );

    scForm.browser.closePopups();
    if (Sitecore.Forms.PopupMenu.activePopup != null && Sitecore.Forms.PopupMenu.activePopup.parentNode != null) {
        $(Sitecore.Forms.PopupMenu.activePopup).remove();
    }
}

var tableLength = null;

Sitecore.ListEditor = new function() {
    this.dictionary = [];
}

function OnAddNewItem(sender, event, position) {

    if (tableLength == null) {
        tableLength = $(ManualSettingsGrid).rows.length;
    }
    else {
        tableLength += 1;
    }

    var row = $(ManualSettingsGrid).insertRow(position + 1);

    var itemValue = row.insertCell(0);
    itemValue.innerHTML = '<input value="' + $('ctl00_ctl05_ctl00_ctl00_ctl04_EmptyValueListItemHolder').value + '" style="width: 100%;" id="wfmListItem_v' + tableLength + '" class="scWfmListItemEdit scWfmEmpty" itemtype="value" onfocus="javascript:return OnListItemFocus(this, event)" onblur="javascript:return OnListItemBlur(this, event)"/>'


    var itemText = row.insertCell(1);
    itemText.innerHTML = '<input value="' + $('ctl00_ctl05_ctl00_ctl00_ctl04_EmptyTextListItemHolder').value + '" style="margin: 0px 0px 0px 5px; width: 100%;" id="wfmListItem_t' + tableLength + '" class="scWfmListItemEdit scWfmEmpty" itemtype="text" onfocus="javascript:return OnListItemFocus(this, event)" onblur="javascript:return OnListItemBlur(this, event)"/>'

    if ($('ctl00_ctl05_ctl00_ctl00_ctl04_ShowOnlyValue').value == 1) {
        itemText.style.display = 'none';
    }


    var addButton = row.insertCell(2);
    addButton.innerHTML = $(ManualSettingsGrid).rows[1].cells[2].innerHTML;
    var removeButton = row.insertCell(3);
    removeButton.innerHTML = $(ManualSettingsGrid).rows[1].cells[3].innerHTML;
}

function OnRemoveItem(sender, event, position) {
    if ($(ManualSettingsGrid).rows.length > 2) {
        $(ManualSettingsGrid).deleteRow(position);
    }
    else {
        $(ManualSettingsGrid).select('input').each(function(element) {
            if (element.readAttribute('itemtype') == 'value') {
                if (element.value != $('ctl00_ctl05_ctl00_ctl00_ctl04_EmptyValueListItemHolder').value) {
                    element.value = '';
                }
            }
            else {
                if (element.value != $('ctl00_ctl05_ctl00_ctl00_ctl04_EmptyTextListItemHolder').value) {
                    element.value = '';
                }
            }
        })
    }
}

function getPosition(element) {
    return IsIE() ? $(element).up('tr').rowIndex : document.activeElement.up('tr').rowIndex;
}

function OnListItemFocus(sender, event) {
    var element = $(sender);
    var itemtype = element.readAttribute('itemtype');
    if (itemtype == 'value' && element.value == $('ctl00_ctl05_ctl00_ctl00_ctl04_EmptyValueListItemHolder').value) {
        element.value = '';

        element.removeClassName('scWfmEmpty');
    }
    else if (itemtype == 'text') {
        var valueElement = element.up().previous().down().value;
        if (element.value == $('ctl00_ctl05_ctl00_ctl00_ctl04_EmptyTextListItemHolder').value.replace('{0}', '') ||
            element.value == $('ctl00_ctl05_ctl00_ctl00_ctl04_EmptyTextListItemHolder').value.replace('{0}', '"' + valueElement + '"')) {
            element.value = '';
            element.removeClassName('scWfmEmpty');
        }
    }
}

function OnListItemBlur(sender, event) {
    var element = $(sender);
    var itemtype = element.readAttribute('itemtype');
    if (element.value == '') {
        if (itemtype == 'value') {
            element.value = $('ctl00_ctl05_ctl00_ctl00_ctl04_EmptyValueListItemHolder').value;
            element.addClassName('scWfmEmpty');
        }
        else {
            var valueElement = element.up().previous().down().value;
            if (valueElement == $('ctl00_ctl05_ctl00_ctl00_ctl04_EmptyValueListItemHolder').value) {
                element.value = $('ctl00_ctl05_ctl00_ctl00_ctl04_EmptyTextListItemHolder').value.replace('{0}', '');
                element.addClassName('scWfmEmpty');
            }
            else {
                element.value = $('ctl00_ctl05_ctl00_ctl00_ctl04_EmptyTextListItemHolder').value.replace('{0}', '"' + valueElement + '"');
                element.addClassName('scWfmEmpty');
            }
        }
    }
}

function showText() {
    showTextColumn();
    return false;
}

function hideText() {
    hideTextColumn();
    return false;
}

function showTextColumn() {
    $('ctl00_ctl05_ctl00_ctl00_ctl04_ShowOnlyValue').value = 0;


    $$('#ManualSettingsGrid  input[itemtype="text"]').each(function(element) { element.up().show() });

    $('ctl00_ctl05_ctl00_ctl00_ctl04_EnterDifferentTextLink').hide();
    $('ctl00_ctl05_ctl00_ctl00_ctl04_UseOnlyValueTextLink').show();

    $('ctl00_ctl05_ctl00_ctl00_ctl04_ValueLockLink').up().morph('width:45%');
    $('TextCaptionGrid').up().show();
}

function hideTextColumn() {
    $('ctl00_ctl05_ctl00_ctl00_ctl04_ShowOnlyValue').value = 1;

    $('ctl00_ctl05_ctl00_ctl00_ctl04_ValueLockLink').up().morph('width:90%', { afterFinish: function() {
        $$('#ManualSettingsGrid  input[itemtype="text"]').each(function(element) { element.up().hide() });
        $('TextCaptionGrid').up().hide();
        $('ctl00_ctl05_ctl00_ctl00_ctl04_EnterDifferentTextLink').show();
        $('ctl00_ctl05_ctl00_ctl00_ctl04_UseOnlyValueTextLink').hide();
    } 
    });
}

function ListItems_OnUpdate() {
    var cols = ListItems.get_table().get_columns();
    if ($('ctl00_ctl05_ctl00_ctl00_ctl04_ShowOnlyValue').value != 1) {
        if (cols[0].Width > 232) {
            cols[0].Width = 232;
            cols[1].Width = 231;
        }
        ListItems.render();
    }
}

function controlValuesLock() {
    if ($('LockValueImage').style.display != 'none') {
        if (confirm(Sitecore.ListEditor.dictionary['unlockValues']) == true) {
            $('UnLockValueImage').style.display = '';
            $('LockValueImage').style.display = 'none';

            $$('#ManualSettingsGrid  input[itemtype="value"]').each(function(element) {

                element.enable(); element.removeClassName("disabled"); element.up().next().next().next().down().down().show();
                element.up().next().next().next().down().down().next().hide();

            });
        }
    }
    else {
        $('UnLockValueImage').style.display = 'none';
        $('LockValueImage').style.display = '';

        $$('#ManualSettingsGrid  input[itemtype="value"]').each(function(element) {
            if (element.value != $('ctl00_ctl05_ctl00_ctl00_ctl04_EmptyValueListItemHolder').value) {
                element.disable(); element.addClassName("disabled");
                element.up().next().next().next().down().down().hide();
                element.up().next().next().next().down().down().next().show();
            } 
        });
    }
    return false;
}