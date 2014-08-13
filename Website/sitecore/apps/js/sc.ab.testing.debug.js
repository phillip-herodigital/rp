(function ($) {
    $.widget("sc.ABTesting",
    {
        options:
        {
            messageCollapseSpeed: 300
        },

        _create: function () {
            var self = this;
            this.abnItems = $('.abn-item', this.element);

            this.abnItems.each(function () {
                var index = Number($(this).attr('display-index'));
                $(this).attr('data-id', String.fromCharCode(65 + index));
                $(this).find('legend .p-title span').append('<span class="abn-letter">' + String.fromCharCode(65 + index) + '</span>');
                self._initItem($(this));
            });
        },

        _destroy: function () {
            $.Widget.prototype.destroy.apply(this);
        },

        //==========================================================================================
        // IZ try to use parents('selector') or closest('selector')
        //==========================================================================================
        _getAncestorByClassName: function (element, ancestorClassName) {
            for (var ancestor = element; ancestor.parentNode; ancestor = ancestor.parentNode) {
                if ($(ancestor).hasClass(ancestorClassName)) {
                    return ancestor;
                }
            }

            return null;
        },
        _initItem: function (abnItem) {
            var itemContent = abnItem.find('legend:first').next(),
                link = $('a.abn-frame:last', itemContent),
                img = link.prev().is("img") ? link.prev() : false;

            if (link.size()) {
                itemContent
                    .append("<div class='frame-content'><iframe src='" + link.attr("href") + "' width='100%' height='100%' /></div>");

                $('iframe', itemContent).load(function () {
                    var body = $('body', $(this).contents())[0];

                    $('#scWebEditRibbon', body).hide();

                    $(body).append("<div style='background: #fff; width: 100%; height: " + body.offsetHeight + "px; opacity: 0; filter: alpha(opacity: 0); position: absolute; top: 0; left; 0;'>");
                });
            }
            img ? img.css('display', 'none').attr('data-importance', 1) : $.noop();
            abnItem.addClass('collapsible portlet').fieldsgroup().collapsible();

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