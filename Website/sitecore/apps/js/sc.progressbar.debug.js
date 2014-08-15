(function ($) {

    $.widget("sc.progressbar", $.extend({}, $.ui.progressbar.prototype,
    {
        _create: function () {
            $.ui.progressbar.prototype._create.apply(this, arguments);

            if (this.options.showLabel) {
                this.element.append("<span class='ui-progressbar-label' style='line-height: " + this.element.height() + "px;'>" + (this.options.value || 0) + "%</span>");
            }
            this.element.attr('data-name', this.element.attr('name') || this.element.closest('[name]').attr('name'));
        },

        _destroy: function () {
            return $.Widget.prototype.destroy.call(this);
        },

        callServer: function (args) {
            $.netajax(this.element, "update:" + args);
        },

        start: function (done) {
            var self = this;
            this.intervalID = window.setTimeout(function () {
                var progressValue = self.options.value;
                if (progressValue == 100) {
                    self.stop();
                } else {
                    self.callServer(progressValue);
                }
            }, self.options.interval || 2000);

        },

        stop: function (done) {
            window.clearTimeout(this.intervalID);
        }

    }));
})(jQuery);﻿
if (typeof (Sys) !== 'undefined') {
    Sys.Browser.WebKit = {};
    if (navigator.userAgent.indexOf('WebKit/') > -1) {
        Sys.Browser.agent = Sys.Browser.WebKit;
        Sys.Browser.version = parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);
        Sys.Browser.name = 'WebKit';
    }
    Sys.Application.notifyScriptLoaded();
}