if (!Sitecore || Sitecore == 'undefined') {
    var Sitecore = new Object();
}

if (!Sitecore.Wfm || Sitecore.Wfm == 'undefined') {
    Sitecore.Wfm = new Object();
}

if (!Sitecore.Wfm.ControlledChecklist || Sitecore.Wfm.ControlledChecklist == 'undefined') {
    Sitecore.Wfm.ControlledChecklist = new Object();
}


Sitecore.Wfm.ControlledChecklist.copyStateToAllSibling = function(ctrl) {
    Sitecore.Wfm.ControlledChecklist.changeStateInAllSibling(ctrl, ctrl.checked);
}

Sitecore.Wfm.ControlledChecklist.updateState = function(sender, elementIndex) {
    var parent = $(sender).up().up().up().up();
    var nodes = parent.select('input[type="checkbox"]');
    var state = true;

    if (!sender.checked) {
        state = false;
    } else {
        nodes.each(function(element, index) {
            if (elementIndex != index && !element.checked) {
                state = false;
            }
        });
    }

    nodes.first().checked = state;
}

Sitecore.Wfm.ControlledChecklist.changeStateInAllSibling = function(ctrl, state) {
    var parent = $(ctrl).up().up().up().up();
    parent.select('input[type="checkbox"]').each(function(element, index) {
        if (index != 0) {
            element.checked = state;
        }
    });
}