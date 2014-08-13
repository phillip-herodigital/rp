(function ($) {
    $.extend(true, $, {
        sc: {
            back: function () {
                var storage = new $.Storage({ 'storageKey': 'previousPage' });
                try {
                    window.document.location.href = localStorage.getItem('previousUrl');
                } catch (e) { }
                return false;
            },
            setBackTitle: function (id, title) {
                var element = $(id).size() ? $(id) : $('#' + id);
                var storage = new $.Storage({ 'storageKey': 'previousPage' });
                document.referrer.indexOf(storage.get('appDomain')) >= 0 ?
                    element.is('input') ? element.attr('value', element.attr('value') + ' ' + (title ? title : storage.get('previousTitle'))) : $.noop() :
                    element.is('input') ? element.attr('value', element.attr('value') + ' ' + document.referrer) : $.noop();
                //storage = new $.Storage();
                $(window).off('beforeunload.prevpage');
            }
        }
    });
})(jQuery);
﻿
if (typeof (Sys) !== 'undefined') {
    Sys.Browser.WebKit = {};
    if (navigator.userAgent.indexOf('WebKit/') > -1) {
        Sys.Browser.agent = Sys.Browser.WebKit;
        Sys.Browser.version = parseFloat(navigator.userAgent.match(/WebKit\/(\d+(\.\d+)?)/)[1]);
        Sys.Browser.name = 'WebKit';
    }
    Sys.Application.notifyScriptLoaded();
}