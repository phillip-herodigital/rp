function textbox_onfocus(control, def)
{
    var control = document.getElementById(control);
    if (control.value == def)
        control.value = '';
}

function textbox_onblur(control, def)
{
    var control = document.getElementById(control);
    if (control.value == '')
        control.value = def;
}