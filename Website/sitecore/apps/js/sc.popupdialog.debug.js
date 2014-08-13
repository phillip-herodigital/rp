(function ($) {

    $.widget("sc.popupdialog", {
        options: {
            rel: '.sc-overlay',
            template: "<div><div class='sc-cover'></div><div class='sc-overlay'><div class='popup-content'></div></div></div>",
            type: 'modal',
            oneInstance: false
        },
        _create: function () {
            var self = this,
                options = this.options;

            this.windowH = $(window).height();
            this.windowW = $(window).width();
            this.element.attr('data-name', this.element.attr('name') || this.element.closest('[name]').attr('name'));
            this._initialize();
            this._bind();
        },
        _initialize: function () {

        },
        _position: function () {
            return { top:
                this.options.size == "full" ?
                 '1%' :
                 (screen.height * 0.4 - (this.overlay().height() / 2) > 0 ?
                    screen.height * 0.4 - (this.overlay().height() / 2) + $(window).scrollTop() :
                    $(window).scrollTop()),
                left:
                    this.options.size == "full" ?
                    '1%' :
                    ($(window).width() - this.overlay().width()) / 2
            };
        },
        _effectStart: function (done) {
            var position = this._position();
            this.overlay().hide().css({
                left: (this.options.size != "full" ? (position.left + "px") : position.left),
                top: (this.options.size != "full" ? (position.top + 'px') : position.top),
                opacity: 1
            }).fadeIn(200, function () { done(); });
            this.cover().css({ "height": $(document).height() + "px", "display": "block", "opacity": "0.7" });
        },
        _effectEnd: function (done) {
            this.overlay().css("display", "none");
            this.cover().css("display", "none");
            done.call();
        },
        _bind: function () {
            var self = this;
            self._onclickref = function (e, m) { self.open(); return false; };
            this.element.on('click', this._onclickref);
        },
        overlay: function () {
            if (!this.scOverlay) {
                this._render();
                this.scOverlay.addClass('popup-instance');
            }

            return this.scOverlay;
        },
        cover: function () {
            return this.scCover;
        },
        _render: function () {
            var self = this;
            var popup = $(this.options.template).prependTo('body');
            this.scOverlay = popup.find(this.options.rel);
            this.scCover = popup.find('.sc-cover');
        },
        open: function (params) {

            var self = this,
            location = false;
            overlay = this.overlay();
            this.params = (typeof (params) == 'string' ? { 'hdl': params} : params) || {};
            location = $.sc.location(self.params, self.options.url ? self.options.url : self.element.attr('href'));
            location.search.size ? self.options.size = location.search.size : $.noop();
            this.url = location.url + ($.param(location.search) ? '?' + $.param(location.search) : ($.param(this.params) ? ('?' + $.param(this.params)) : ''));

            this._loading(function () {
                self.options.beforeLoaded ?
                self.options.beforeLoaded(overlay, self) :
                $.noop();
                self.overlay().trigger('contentchanged');
                self._effectStart(function () { self._loaded(); });
                overlay.prev().size() ? overlay.prev('.popup-content').trigger('contenthide') : $.noop();
                overlay.trigger('contentshow');
            });

            return false;
        },
        close: function (a) {
            var self = this;
            if (this._changesCommited()) {
                self._effectEnd(function () {
                    self.element.triggerHandler('popupdialogclose', [a || '']);
                    self.overlay().off().empty();
                });
            }
        },

        _close: function (a, hdl) {
            $.netajax(this.element, "close:" + hdl + ":" + ((a.result && a.result != '') ? a.result : '') + ":" + (a.updated != '' ? a.updated : ''));
            return false;
        },
        _loadingError: function (response, status, xhr, loaded) {
            loaded ? loaded() : $.noop();
            if (status == "error") {
                $('body').triggerHandler("messagesend", {
                    "text": response,
                    "type": "sys"
                });
                this.cover() ? this.cover().css('display', 'none') : $.noop();
            }
        },
        _loading: function (loaded) {
            var self = this;
            (this.overlay()
                .find(".popup-content:parent:last").add(this.overlay()).first()).empty()
                .load((this.url || this.options.url || this.element.attr("href"))
                .replace(' ', '%20'), function (response, status, xhr) {

                    self._loadingError(response, status, xhr, loaded);
                });
        },
        _changesCommited: function (forms) {

            var settings = { modified: false };
            (forms || this.overlay().find('form')).trigger('beforeunload.popupdialog', [settings]);

            /*Recursive inline function to detect scForm modified*/
            var scModified = false;
            (function DetectScFormModifications(element) {
                $('iframe', element).each(function (index, iframe) {
                    var scForm = iframe.contentWindow.scForm;
                    if (scForm && scForm.modified) {
                        scModified = scModified || scForm.modified;
                    }
                    DetectScFormModifications($(iframe).contents());
                });
            })(this.overlay());

            if (scModified) {
                /* It's just browser confirm dialog */
                !settings.message ? settings.message = scForm.translate("There are unsaved changes.") : $.noop();
                return confirm(settings.message);
            }
            return true;
        },
        _loaded: function () {
            var self = this,
                overlay = this.overlay();

            self.options.resizable ? this.scOverlay.find('.ui-dialog').resizable({ maxHeight: 400, maxWidth: 600, minHeight: 200, minWidth: 400 }) : $.noop();
            self.options.draggable ? this.scOverlay.draggable({ handle: '.ui-dialog-titlebar' }) : $.noop();

            overlay.find('.ui-dialog-buttonset>input:first').focus();
            overlay.find('form').on('popupdialogclose', function (e, a) { self.close(a); });
            this.element.off('.sc').on('popupdialogclose.sc', function (e, a) { self._close(a, self.params.hdl); });

        },
        destroy: function () {
            this.element.off('click', this._onclickref);
            this.element.off(".sc");
            return $.Widget.prototype.destroy.call(this);
        }
    });

})(jQuery);

$(function () {
    $.ajaxPrefilter("script", function (options, originalOptions, jqXHR) {
        if ($('script')) {
            $('script').each(function () {
                if ((options.url || '').indexOf($(this).attr('src')) !== -1) {
                    jqXHR.abort();
                    return false;
                }
                return undefined;
            });
        }
    });
});﻿(function ($) {
    var prototype = $.sc.popupdialog.prototype;
    $.widget("sc.popupdialog", $.extend({}, prototype, {
        _initialize: function () {
            var self = this;
            if (this.options.type == "smartpanel") {
                this.options.template = '<div class="popup-content"></div>';
                this.options.rel = '.smart-panel';
                this.direction = 'right';
                this.options.width = this.options.width ? this.options.width : 500;

                var onResize = function () {
                    if (self.windowH != $(window).height()) {
                        self.overlay().closest('.smart-panel').css({ 'height': $(window).height() + 'px' });
                        self.windowH = $(window).height();
                    }
                    if (self.windowW != $(window).width()) {
                        self._position();
                        self.windowW = $(window).width();
                    }
                };
                $(window).off('resize').on('resize', function () {
                    onResize();
                });
            }

            prototype._initialize.apply(this, arguments);
        },

        open: function (params, replace) {
            var self = this,
                location = false;
            overlay = this.overlay();

            if (this.options.type == "smartpanel") {
                this.element.off('click').on('click', function (e) { return false; });
                if (overlay.find('form').size() > 0 && !replace) {
                    if (this._changesCommited(overlay.closest('.smart-panel').find('form'))) {
                        this.overlay().closest('.container').css('left', '0px');
                        this.open(params, true);
                        this.element.closest('form').off('click');
                    } else {
                        this._cancel(params);
                    }
                } else {
                    prototype.open.apply(this, arguments);
                }
            } else {
                prototype.open.apply(this, arguments);
            }
        },
        _position: function () {
            if (this.options.type == "smartpanel") {
                var pageContent = $('body .content').size() ? $('body .content') : $('body'),
                    panel = this.overlay().closest('.smart-panel');
                this.direction = (($(window).width() - pageContent.outerWidth()) / 2) > this.options.width ? 'left' : 'right';
                this.direction === 'left' ?
                    panel.css('left', pageContent.offset().left + pageContent.outerWidth() + 'px') :
                    panel.css({ 'left': 'auto', 'right': ($(window).width() - pageContent.outerWidth()) > 0 ? '0px' : ($(window).width() - (pageContent.offset().left + pageContent.outerWidth())) + 'px' });
            } else {
                return prototype._position.apply(this, arguments);
            }
        },
        _cancel: function (hdl) {
            $.netajax(this.element, "cancel:" + hdl);
            this.element.trigger('cancelopen');
        },

        _effectStart: function (done) {
            var self = this,
                overlay = this.overlay();
            if (this.options.type == "smartpanel") {
                this.element.closest('form').find('input[type=submit]').on('click', function (e) {
                    e.stopImmediatePropagation();
                });
                this.element.closest('form').on('click', function (e, a) { self.close(a); });
                $(window).scrollTop() > $('body').find('.header').outerHeight() ?
                    overlay.css({ 'padding-top': '0px' }) : $.noop();
                this.overlay().closest('.smart-panel').css({ 'display': 'block', opacity: 1, height: $(window).scrollTop() > $('body').find('.header').outerHeight() ? $(window).height() + 'px' : $('body .page-content:first').height() + 'px' })
                    .animate({ width: this.options.width + 'px' }, 200, function () {
                        self.element.triggerHandler('aftereffectstart');
                        done.call();
                    });

            } else {
                prototype._effectStart.apply(this, arguments);
            }
        },

        _effectEnd: function (done) {
            if (this.options.type == "smartpanel") {
                var value = $('body > form .ui-jqgrid').parent('div').find('input:first-child[type=hidden]').val().substr(1);
                $('.ui-jqgrid').parent('div').find('input:first-child[type=hidden]').val("0" + value);

                this.element.closest('form').off('click');
                this.overlay().closest('.smart-panel').animate({ width: '0px' }, 200, function () {
                    $(this).css({ display: 'none' });
                    done.call();
                });
            } else {
                prototype._effectEnd.apply(this, arguments);
            }
        },
        _windowOnScroll: function () {
            var self = this;
            $(window).off('scroll.smart').on('scroll.smart', function () {
                $(window).scrollTop() < $('body').find('.header').outerHeight() ?
                    self.overlay()
                        .closest('.smart-panel').css({ position: 'absolute', height: $('body .page-content:first').height() + 'px' }).find('.popup-content').css({ 'padding-top': $('body').find('.header').outerHeight() + 'px' }) :
                    self.overlay().closest('.smart-panel').css({ position: 'fixed', height: $(window).height() }).find('.popup-content').css({ 'padding-top': '0px' });
            });
        },
        _panelOffset: function (panel) {
            $(window).scrollTop() < $('body').find('.header').outerHeight() ?
                panel.css({
                    'width': '0px',
                    'top': '0px',
                    'height': $('body .page-content:first').height() + 'px',
                    position: 'absolute'
                }) :
                panel.css({
                    'width': '0px',
                    'top': '0px',
                    'height': $(window).height() + 'px',
                    position: 'fixed'
                }).find('.popup-content:first').css({ 'padding-top': '0px' });
        },

        _render: function () {
            if (this.options.type == "smartpanel") {
                var options = this.options,
                    self = this;
                pageContent = $('body .content'),
                panel = null;

                if (!$('body .smart-panel').size()) {
                    panel = $('<div class="smart-panel"><div class="wrapper"><div class="container"></div></div></div>').prependTo($('body'));
                    panel.find('.container').append($(options.template, {}));
                    self._panelOffset(panel);
                    self._windowOnScroll();
                } else {
                    panel = $('body .smart-panel');
                    $('body .smart-panel').find('.popup-content').size() ? $.noop() : $('body .smart-panel').find('.container').append($(options.template, {}));
                }

                this.scOverlay = $('.popup-content:first', panel).css({ height: pageContent.height() + 'px', width: this.options.width + 'px', 'padding-top': $(window).scrollTop() < $('body').find('.header').outerHeight() ? $('body').find('.header').outerHeight() + 'px' : '0px' });

                self._position();
            } else {
                prototype._render.apply(this, arguments);
            }
        },
        _bind: function () {
            var self = this;
            if (this.options.type == "smartpanel") {
                this._onclickref =
                    function () {
                        self.open();
                        return false;
                    };
                this.element.off('click').on('click', this._onclickref);
                this.element.off('aftereffectstart.smart').on('aftereffectstart.smart', function () {
                    self._bind();
                });
            } else {
                prototype._bind.apply(this, arguments);
            }

        }
    }));
})(jQuery);
﻿(function ($) {

    var prototype = $.sc.popupdialog.prototype;

    $.widget("sc.popupdialog", $.extend({ }, prototype, {
        _initialize: function() {
            this.isSmartCarrousel = this.options.type == "smartpanel" && $(this.element).closest(".smart-panel").size();
            if (this.isSmartCarrousel) {
                this.options.template = '<div class="switched-content popup-content"></div>';
                this.options.rel = '.smart-panel';
                var a = 0;
            } else {
                prototype._initialize.apply(this, arguments);
            }
        },

        _effectStart: function(done) {
            var container = this.overlay().closest('.container'),
                self = this;
            if (this.isSmartCarrousel) {
                this.overlay().css({ 'display': 'block', opacity: 1, height: $(window).scrollTop() > $('body').find('.header').outerHeight() ? $(window).height() + 'px' : $('body .page-content:first').height() + 'px' }).closest('.container').animate({ left: (self.leftOffset) + 'px' }, 300, function() {
                    done.call();
                    self.element.triggerHandler('aftereffectstart');
                });
            } else {
                prototype._effectStart.apply(this, arguments);
            }
        },

        _effectEnd: function(done) {

            var self = this,
                container = this.overlay().closest('.container');

            if (this.isSmartCarrousel) {
                container.animate({ left: (self.leftOffset + self.options.width) + 'px' }, 300, function() {
                    done.call();
                    self.overlay().empty();
                    self.overlay().next().remove();
                    container.width(container.width() - self.options.width);
                });
            } else {
                prototype._effectEnd.apply(this, arguments);
            }
        },

        _render: function() {
            if (this.isSmartCarrousel) {
                this.panelObj = $.tmpl(this.options.template, { });
                $('.smart-panel .wrapper .container').append(this.panelObj);
                this.scOverlay = this.panelObj;
                this.options.width = this.options.width ? this.options.width : this.overlay().closest('.container').find('.popup-content:first').width();
                this.panelObj.css({ width: this.options.width + 'px' });
                this.leftOffset = -(this.overlay().closest('.container').find('.popup-content').size() - 1) * this.options.width;
                $(window).trigger('scroll');
                return;
            }
            prototype._render.apply(this, arguments);
        },

        _loading: function(loaded) {
            var done = loaded ? loaded : $.noop,
                overlay = this.overlay(),
                self = this;
            this.isSmartCarrousel ? overlay.css('display', 'none') : $.noop();
            prototype._loading.apply(this, [function() {
                if (self.isSmartCarrousel) {

                    overlay.closest('.container').width(overlay.closest('.container').width() + self.options.width);

                    $('.ui-dialog-content .ui-dialog-back', overlay).show().click(function() {
                        $.globalEval(overlay.find('.close:first').attr('href'));
                    });
                }
                done();
            }]);

        },

        open: function(params, content) {
            prototype.open.apply(this, [params, this.isSmartCarrousel || content]);
        },

        destroy: function() {
            if (this.isSmartCarrousel) {
                this.overlay().remove();
            }
            prototype.destroy.apply(this, arguments);
        }
    }));
})(jQuery);﻿(function ($) {

    var prototype = $.sc.popupdialog.prototype;

    $.widget("sc.popupdialog", $.extend({ }, prototype, {
        open: function(param, content) {
            if (this.options.type == 'smartpanel') {
                var self = this,
                    overlay = this.overlay();

                overlay.on('contentshow', function() {
                    overlay.prev().find('.notify-item-wrapper').each(function() {
                        var data = $(this).tmplItem().data;
                        data.hidden = true;
                        overlay.find('form').triggerHandler('validatehighlight', data);
                    });

                });

                overlay.on('validatefocus', function(e, v) {
                    if (self._changesCommited(overlay.nextAll('.popup-content').find('form'))) {
                        overlay.closest('.container').animate({ left: (parseInt(overlay.closest('.container').css('left'), 10) + (overlay.closest('.container').width() - overlay.position().left - overlay.width()) + 'px') }, 300, function() {
                            overlay.closest('.container').width((overlay.closest('.container').width() - (overlay.closest('.container').width() - overlay.position().left)) + overlay.width());
                            overlay.next().empty();
                            overlay.next().nextAll('.popup-content').remove();
                        });
                    }
                });
            }
            prototype.open.apply(this, arguments);
        }
    }));

})(jQuery);﻿(function ($) {

    var prototype = $.sc.popupdialog.prototype;

    $.widget("sc.popupdialog", $.extend({ }, prototype, {
        _initialize: function() {
            if (this.options.type == "inline") {
                this.options.template = "<div><div class='sc-overlay inline'><div class='popup-content'></div></div></div>";
            }
            prototype._initialize.apply(this, arguments);
        },

        _effectStart: function(done) {
            var self = this;

            if (this.options.type == "inline") {
                $('.sc-overlay.inline').find('form').trigger('popupdialogclose');
                content = $('.content').size() ? $('.content') : $('body');
                this.overlay().hide().css({
                    left: this.element.offset().left + (((content.offset().left + content.width()) - this.element.offset().left) > this.overlay().width() ? -16 : (16 + this.element.width()) - this.overlay().width()),
                    top: this.element.offset().top + this.element.outerHeight() + 'px',
                    opacity: 1
                }).fadeIn(200, function() {
                    self.element.addClass('pressed');
                    done();
                });
            } else {
                prototype._effectStart.apply(this, arguments);
            }
        },

        _effectEnd: function(done) {
            if (this.options.type == "inline") {
                this.overlay().empty();
                this.element.removeClass('pressed');
                done.call();
            } else {
                prototype._effectEnd.apply(this, arguments);
            }
        },

        _render: function() {
            var self = this;
            prototype._render.apply(this, arguments);
        },

        _bind: function() {
            if (this.options.type == "inline") {
                this.overlay().on('click', function(e) { e.stopPropagation(); });
            }
            prototype._bind.apply(this, arguments);
        },

        _loaded: function() {
            var self = this;
            if (this.options.type == "inline") {
                $('body').on('closepopup', function() { self.close(); })
                    .on('click', function() {
                        $('body').trigger('closepopup');
                        $('body').off('closepopup');
                    });
            }
            prototype._loaded.apply(this, arguments);
        }
    }));
})(jQuery);﻿(function ($) {

    var prototype = $.sc.popupdialog.prototype;

    $.widget("sc.popupdialog", $.extend({ }, prototype, {
        cover: function() {
            return this.options.type == "modalless" || this.options.type == "modelessdialog" ? $() : prototype.cover.apply(this, arguments);
        },

        _bind: function() {
            if (this.options.type == "modalless" || this.options.type == "modelessdialog") {
                this.overlay().on('click', function(e) { e.stopPropagation(); });
            }
            prototype._bind.apply(this, arguments);
        },

        _loaded: function() {
            var self = this;
            if (this.options.type == "modalless" || this.options.type == "modelessdialog") {
                $('body').on('closepopup', function() { self.close(); })
                    .on('click', function() {
                        $('body').trigger('closepopup');
                        $('body').unbind('closepopup');
                    });
            }
            prototype._loaded.apply(this, arguments);
        }
    }));
})(jQuery);
﻿(function ($) {

    var prototype = $.sc.popupdialog.prototype;

    $.widget("sc.popupdialog", $.extend({}, prototype, {
        _initialize: function () {
            var self = this;
            this.sizes = {
                small: { width: 360, minHeight: 120, maxHeight: 250 },
                standard: { width: 490, minHeight: 200, maxHeight: 350 },
                large: { width: 560, minHeight: 400, maxHeight: 500 },
                extralarge: { width: 680, minHeight: 500, maxHeight: 650 },
                full: { width: '98%', minHeight: '98%', maxHeight: '98%' }
            };
            this.options.type == 'modal' || this.options.type == 'modalless' || this.options.type == 'modelessdialog' || this.options.type == 'inline' ? this.overlay().off('filteropen.popup filterbeforeclose.popup addexpression.popup removeexpression.popup addexpression.popup renderchoice.popup').on('filteropen.popup filterbeforeclose.popup addexpression.popup removeexpression.popup addexpression.popup renderchoice.popup', function () {
                self._size();
            }) : $.noop();
            prototype._initialize.apply(this, arguments);
        },
        _size: function () {
            var self = this,
                dialog = this.overlay().find('.ui-dialog').size() ?
                    this.overlay().find('.ui-dialog') :
                    this.overlay().find('form');
            dialog
                .find('.ui-dialog-main-content')
                .css({ 'overlfow': 'visible', 'max-height': 'none', 'min-height': 'auto', 'height': 'auto' });
            this.overlay().is(':visible') ?
                $.noop() :
                this.overlay().css({ left: '-1000px', display: 'block' });
            var currentSize = 'small';
            self.options.size ?
                currentSize = self.options.size :
                $.each(this.sizes, function (index, size) {
                    if (index != "full") {
                        currentSize = index;
                        return dialog.css({ 'width': size.width }).height() < size.maxHeight ? false : true;
                    }
                });
            self.options.size = currentSize;
            var layoutHeight = 0;
            currentSize == "full" ? self.overlay().css({ width: this.sizes[currentSize].width, height: this.sizes[currentSize].minHeight }) : $.noop();
            dialog
                .css({
                    'width': this.sizes[currentSize].width,
                    overflow: 'auto'
                })
                .find('.ui-dialog-content > div')
                .filter(function () {
                    return !$(this).hasClass('ui-dialog-main-content');
                })
                .each(function () {
                    layoutHeight += $(this).is(':visible') ? $(this).outerHeight() : 0;
                });

            dialog.height() > this.sizes[currentSize].maxHeight ?
                dialog.find('.ui-dialog-main-content').css({ 'max-height': (this.sizes[currentSize].maxHeight - layoutHeight) + 'px' }) :
                dialog.css({ 'min-height': this.sizes[currentSize].minHeight + 'px', 'max-height': this.sizes[currentSize].maxHeight + 'px' })
                    .closest('.sc-overlay').css(currentSize == 'small' ? { 'min-width': '300px'} : {});

            if (currentSize == 'full' && (dialog.find('.sc-scrollbox').size() > 0 || dialog.find('iframe').size() > 0)) {
                this._usefulHeight(dialog);
                $(window).off('resize').on('resize', function () {
                    self._usefulHeight(dialog);
                });
            }

        },

        _usefulHeight: function (dialog) {
            var height = $(window).height() * 0.96 - this.scOverlay.find('.ui-dialog-title').outerHeight() - (this.scOverlay.find('.ui-dialog-buttonset').outerHeight() || 0) - 10,
                overflow = dialog.find('.sc-scrollbox').size() > 0 ? 'auto' : 'hidden';
            dialog
                .find('.ui-dialog-main-content')
                .css({ 'overflow': overflow, 'height': height });
        },

        _loaded: function () {
            var self = this;
            prototype._loaded.apply(this, arguments);
            if (self.options.size && self.options.size == "full" && self.options.type != "smartpanel") {
                this.overlay().css('position', 'fixed');
            }
        },
        _render: function () {
            var self = this;
            prototype._render.apply(this, arguments);

            this.options.type == 'modal' || this.options.type == 'modalless' || this.options.type == 'modelessdialog' || this.options.type == 'inline' ? this.overlay().off('contentchanged.sc').on('contentchanged.sc', function () {
                self._size();
            }) : $.noop();
        }
    }));
})(jQuery);


(function ($) {
    $.extend($, {
        confirm: function () {
            this.options = {
                url: "/sitecore/apps/dialogs/popupconfirmation.aspx",
                title: false,
                details: false,
                yes: "Yes",
                no: "No",
                icon: false,
                context: false
            };

            var self = this,
            defer = $.Deferred();
            $.each(arguments, function (i, arg) {
                i == 0 && typeof (arg) == 'string' ? self.options.title = arg : $.noop();
                i == 1 && typeof (arg) == 'string' ? self.options.details = arg : $.noop();
                typeof (arg) == 'object' ?
                    self.options = $.extend({}, self.options, arg) :
                    $.noop();
            });
            this.options.beforeLoaded = function (overlay, popup) {
                overlay.find('.ui-dialog').addClass('messagebox').css('width', overlay.find('.ui-dialog').css('width'));
                var template = $("<p>").append(overlay.find('form')).html();
                $.tmpl(template, self.options).appendTo(overlay);
                overlay.trigger('contentchanged');
                overlay.find('input[type="submit"], input[type="button"]').click(function () {
                    $('.prompt-content').size() ?
                    ($(this).attr('id') == 'yes' ? defer.resolve($('.prompt-content input')) : defer.resolve(false)) :
                    defer.resolve($(this).attr('id'));
                    popup.close();
                    return false;
                });
                overlay.find('.close:first').click(function () { popup.close(); return false; });
            };
            var element = this.options.context ? this.options.context : $("<div/>");
            
            element.popupdialog({ url: this.options.url, beforeLoaded: this.options.beforeLoaded, type: this.options.type ? this.options.type : 'modal' }).on('popupdialogclose', function (e, a) {
                e.stopImmediatePropagation();
                return false;
            })
            .popupdialog('open');

            return defer.promise();
        }
    });
})(jQuery)
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