(function ($) {
    $(function() {
        if (typeof Sys !== 'undefined' && typeof Sys.WebForms !== 'undefined' && typeof Sys.WebForms.PageRequestManager !== 'undefined') {
            with (Sys.WebForms.PageRequestManager.getInstance()) {

                //                add_initializeRequest(function (s, e) {
                //                   a.set_cancel($(a.get_postBackElement()).hasClass('sc-partial-update') || $(a.get_postBackElement()).closest('.popup-instance').size());
                //                });

                add_pageLoading(function(s, a) {
                    $.each(a.get_dataItems() || [], function(name, value) {
                        try {
                            $("#" + name).replaceWith(value);
                        } catch(e) {
                        }
                        ;
                    });
                });

                add_endRequest(function(s, a) {
                    if (a.get_error()) {
                        $(s._form).trigger('responseerror', (a.get_error().message || ''));
                        a.set_errorHandled(true);
                    }
                });
            }
        }
    });
})(jQuery)﻿
if (typeof (Sys) !== 'undefined') {
    Sys.Browser.WebKit = {};
    if (navigator.userAgent.indexOf('WebKit/') > -1) {
        Sys.Browser.agent = Sys.Browser.WebKit;
        Sys.Browser.version = parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);
        Sys.Browser.name = 'WebKit';
    }
    Sys.Application.notifyScriptLoaded();
}