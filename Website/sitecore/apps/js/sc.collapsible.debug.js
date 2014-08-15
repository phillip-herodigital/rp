(function ($) {

    $.widget("sc.collapsible", {

        options: {
            header: 'legend',
            icons: { header: 'ui-arrow-up', headerSelected: 'ui-arrow-down' },
            view: 'default',
            collapsible: true,
            headerHide: false
        },

        _create: function () {
            var self = this;
            //var options = self.options;
            self.element.next().size() ? self.element.css('margin-bottom', '20px') : $.noop();
            self.element.parents('.right-content:first').size() ? self.options.view = 'simple' : $.noop();
            self.element.addClass('ui-' + self.options.view + '-view');
            if (!this.element.parents('.collapsible, .abn-item').size()) {
                self.element.hasClass('collapsible') ? self._initialize() : $.noop();
            } else {
                self.element.addClass('collapsible-in-collapsible');
            }

        },
        _initialize: function () {
            var self = this,
            options = self.options;

            var storageOptions = { 'storageKey': document.location.pathname.replace(/[\/,\?,\&,\-,\{,\},\=\#\%\.\:]/g, '') };

            this.storage = new $.Storage(storageOptions);

            self.element.find('filedset:first').addClass('ui-accordion');
            self.headers = self.element.find(options.header + ':first');
            self._bind();
            self.headers.next().addClass("ui-accordion-content");

            if (!self.headers.find('.p-title > .ui-icon').size()) {
                !self.headers.find('.p-title').size() ? self.headers.html("<span class='p-title'>" + self.element.find(options.header + ':first').html() + "</span>") : $.noop();
                options.collapsible ? self.headers.prepend($('<span class="ui-icon"></span>').addClass(options.icons.header)) : $.noop();                
            }

            this.storage.get(this.element.attr('id') ? this.element.attr('id') : this.element.attr('data-id') + '_collapsible') == 'collapsed' ? this.element.addClass('collapsed') : $.noop();

            if (self.element.hasClass('collapsed')) {
                self.headers.next().slideToggle(0);
                self.element.trigger('aftertoggle');
                self.headers.addClass('ui-state-default').find('span.ui-icon:first').removeClass(options.icons.header).addClass(options.icons.headerSelected);
            } else {
                self.headers.addClass('ui-state-active')/*.next().show()*/;
            }

            $('.ui-accordion-content', self.element.closest('.collapsed')).css('display', 'none');
            self.element.hasClass('collapsed') ? self.element.find('span.ui-icon:first').removeClass(options.icons.header).addClass(options.icons.headerSelected) : $.noop();

            this.element.find('.popup-menu').css('position', 'absolute');
            this.element.find('.favorite').on('click', function (e) { e.stopImmediatePropagation(); });

            self.options.headerHide ? self.headers.css({ 'display' : 'none' }) : $.noop();
        },

        _toggle: function () {
            var self = this,
                options = this.options,
                header = self.headers;
            self.element.trigger('beforetoggle');
            !header.find('span.ui-icon:first').hasClass(options.icons.header) ?
                    self.element.find('input[type=text], textarea').each(function () { $(this).val($(this).val().replace('&lt;', '<').replace('&gt;', '>').replace('&quot;', '"')); }) :
                    $.noop();
            $('html, body').animate({ scrollTop: self.headers.top }, 500);
            header.next().height(header.next().height());
            header.next().slideToggle('bounceslide', function () {
                header.find('span.ui-icon:first').each(function () {
                    if ($(this).hasClass(options.icons.header)) {
                        self.element.find('input[type=text], textarea').each(function () { $(this).val($(this).val().replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')); });
                        header.removeClass('ui-state-active').addClass('ui-state-default');
                        $(this).removeClass(options.icons.header).addClass(options.icons.headerSelected);
                        self.element.trigger('hide', header);
                        self.storage.set(self.element.attr('id') ? self.element.attr('id') : self.element.attr('data-id') + '_collapsible', 'collapsed');
                        self.element.trigger('aftertoggle');

                    } else {
                        header.removeClass('ui-state-default').addClass('ui-state-active');
                        $(this).removeClass(options.icons.headerSelected).addClass(options.icons.header);
                        self.element.find('input:first').focus();
                        self.element.trigger('show', header);
                        self.storage.set(self.element.attr('id') ? self.element.attr('id') : self.element.attr('data-id') + '_collapsible', 'expanded');
                    }
                });
            });

            return false;
        },

        _bind: function () {
            var self = this;
            //var options = this.options;
            this.headers
            .addClass('ui-accordion-header')
            .on("mouseenter.collapsible", function () { $(this).addClass("ui-state-hover"); })
            .on("mouseleave.collapsible", function () { $(this).removeClass("ui-state-hover"); })
            .on("focus.collapsible", function () { $(this).addClass("ui-state-focus"); })
            .on("blur.collapsible", function () { $(this).removeClass("ui-state-focus"); })
            .click(function () {
                self.options.collapsible ? self._toggle() : $.noop();
            });
            this.element.on('show', function () { self.headers.next().css('height', 'auto'); });
        },

        destroy: function () {
            return $.Widget.prototype.destroy.call(this);
        },

        _setOption: function (key, value) {
            $.Widget.prototype._setOption.apply(this, arguments);

            if (key == "toggle") {
                $(this.headers[value]).trigger('click');
            }
        }
    });

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