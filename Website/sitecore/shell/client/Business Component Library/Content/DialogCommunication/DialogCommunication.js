/// <reference path="../../../../../../assets/lib/dist/sitecore.js" />


define(["sitecore"], function (_sc) {
    var DialogCommunication = _sc.Definitions.App.extend({
        initialized: function () {
            _sc.on("sc-frame-message", function (value) {
                alert(window.frames.returnValue);
                this.DialogWindow.hide();
            }, this);
        }
    });

    return DialogCommunication;
});