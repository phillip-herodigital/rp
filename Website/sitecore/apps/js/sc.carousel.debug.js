(function ($) {
    $.widget("sc.carousel", {
        options: {
            itemWidth: 200,
            itemHeight: 200,
            visible: 1,
            paging: true,
            pagingNumbers: false,
            controls: true,
            type: 'horisontal',
            prev: '',
            next: '',
            scroll: 1,
            selected: 0,
            circular: false,
            effectSpeed: 200
        },
        _create: function () {
            this._initialize();
            this._render();
            this._bind();
        },
        _initialize: function () {
            var self = this;
            this.pages = parseInt(this.element.find('li').size() / this.options.scroll, 10) + (this.element.find('li').size() % this.options.scroll ? 1 : 0);
            this.options.selected = this.options.selected ?
                this.options.selected >= this.pages ? 0 : this.options.selected : 0;
            this.lastPageOffset = this.element.find('li').size() - this.options.scroll;
            self.element
                .addClass('sc-carousel').addClass(this.options.type)
                .find('li').css({ 'width': this.options.itemWidth + 'px', 'height': this.options.itemHeight + 'px', overflow: 'hidden' });
            self.element.find('ul')
                .width(self.options.type == 'horisontal' ? self.element.find('li').outerWidth(true) * self.element.find('li').size() : self.element.find('li').outerWidth(true))
                .wrap('<div class="carousel-inner" style="height:' + (self.options.type == 'horisontal' ? self.element.find('li:first').outerHeight(true) : self.element.find('li:first').outerHeight(true) * self.options.visible) + 'px; width:' + (self.options.type == 'horisontal' ? self.element.find('li:first').outerWidth(true) * self.options.visible : self.element.find('li:first').outerWidth(true)) + 'px"></div>');
            this.options.type == 'vertical' ? self.element.width(self.element.find('ul').outerWidth()) : $.noop();
        },
        _render: function () {
            var self = this;
            this.options.controls ? this._controls() : $.noop();
            this.options.paging ? this._paging() : $.noop();

        },
        _bind: function () {
            var self = this;
            this.prev ? this.prev.unbind('click.carousel').bind('click.carousel', function () {
                if (self.options.selected) {
                    self.options.selected--;
                    self._effect(self.options.selected, function () { self._disableControls(); });
                } else {
                    self.options.circular ? self._effect(self.pages - 1).options.selected = self.pages - 1 : $.noop();
                }
                return false;
            }) : $.noop();
            this.next ? this.next.unbind('click.carousel').bind('click.carousel', function () {
                if (self.options.selected + 1 != self.pages) {
                    self.options.selected++;
                    self._effect(self.options.selected, function () { self._disableControls(); });
                } else {
                    self.options.circular ? self._effect(0).options.selected = 0 : $.noop();
                }
                return false;
            }) : $.noop();
            this.paging ? this.paging.find('a').each(function (i, v) {
                $(this).unbind('click.carousel').bind('click.carousel', function () { self._effect(i, function () { self.options.selected = i; self._disableControls(); }); return false; });
            }) : $.noop();
        },
        _controls: function () {
            this.prev = $('<a href="#" class="carousel-prev' + (!this.options.selected && !this.options.circular ? ' disable' : '') + '" >' + this.options.prev + '</a>').prependTo(this.element);
            this.next = $('<a href="#" class="carousel-next' + (this.options.selected + 1 == this.pages && !this.options.circular ? ' disable' : '') + '" >' + this.options.next + '</a>').prependTo(this.element);
        },
        _paging: function () {
            this.paging = $('<div class="carousel-paging"></div>').appendTo(this.element);
            for (var i = 0; i < this.pages; i++) {
                this.paging.append('<a href="#" ' + (i == 0 ? 'class="first"' : (i == (this.pages - 1)) ? 'class="last"' : '') + '>' + (this.options.pagingNumbers ? (i + 1) : '') + '</a>');
            }
            $(this.paging.find('a')[this.options.selected]).addClass('active');
            this.paging.css('float', 'left').css('width', this.paging.width() + 'px').css('float', 'none');
        },
        _effect: function (i, done) {
            var offsetIndex = (i + 1 == this.pages ? this.lastPageOffset : i * this.options.scroll);
            var self = this,
                css = this.options.type == 'horisontal' ? { left: -$(self.element.find('li')[offsetIndex]).position().left + 'px' } : { top: -$(self.element.find('li')[offsetIndex]).position().top + 'px' };
            self.element.find('ul').animate(css, this.options.effectSpeed,
                function () {
                    self.paging ? $(self.paging.find('a').removeClass('active')[i]).addClass('active') : $.noop();
                    done ? done() : $.noop();
                });
            return this;
        },
        _disableControls: function () {
            !this.options.circular ? this.options.selected ? this.prev.removeClass('disable') : this.prev.addClass('disable') : $.noop();
            !this.options.circular ? this.options.selected + 1 != this.pages ? this.next.removeClass('disable') : this.next.addClass('disable') : $.noop();
        },
        destroy: function () {
            return $.Widget.prototype.destroy.call(this);
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