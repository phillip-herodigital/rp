

if (!Sitecore) {
    var Sitecore = new Object();
}

if (!Sitecore.Wfm) {
    Sitecore.Wfm = new Object();
}


Sitecore.Wfm.leapYear = function(year) {
    Last2Digits = year % 100
    if (Last2Digits == 0) {
        flag = year % 400
    }
    else {
        flag = year % 4
    }

    return flag == 0;
}

Sitecore.Wfm.getDays = function(month, year) {
    var days = 31;
    switch (month) {
        case 2: days = (Sitecore.Wfm.leapYear(year)) ? 29 : 28;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            days = 30;
            break;
    }

    return days;
}

Sitecore.Wfm.UpdateDateSelector = function(obj) {
    var fieldItem = Sitecore.Wfm.getAttributeAncestor(obj, "fieldid", true);
    var id = fieldItem.id;
    if ($(id + '_month') != null && $(id + '_year') != null) {
        var year = $(id + '_year');
        var month = $(id + '_month');
        var days = Sitecore.Wfm.getDays(parseInt(month.selectedIndex + 1, 10), parseInt(year.selectedIndex, 10));
        var selectDays = $(id + '_day');
        if (selectDays != null) {
            while (selectDays.length > days) {
                selectDays.remove(selectDays.length - 1);
            }
            while (selectDays.length < days) {
                var option = document.createElement('option');
                option.text = selectDays.length + 1;
                option.value = selectDays.length + 1;
                try {
                    selectDays.add(option, null);
                }
                catch (ex) {
                    selectDays.add(option);
                }
            }
        }
    }
    if (Sitecore.Wfm.AttributeKey != null) {
        Sitecore.Wfm.updateDateComplexValue(obj);
    }
}